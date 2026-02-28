
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user && session.user.user_metadata?.role === 'job_seeker') {
        try {
          const { data: existingCV } = await supabase
            .from('cvs')
            .select('id')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (!existingCV) {
            const meta = session.user.user_metadata || {};
            await supabase.from('cvs').insert({
              user_id: session.user.id,
              name: meta.full_name || 'İsimsiz Kullanıcı',
              profession: meta.profession || 'Belirtilmedi',
              city: meta.city || 'Belirtilmedi',
              experience_years: meta.experience_years ? Number(meta.experience_years) : 0,
              experience_months: meta.experience_months ? Number(meta.experience_months) : 0,
              email: session.user.email,
              skills: [],
              education_details: [],
              work_experience: [],
              internship_details: [],
              language_details: [],
              certificates: [],
              is_new: true,
              views: 0,
              is_placed: false,
              is_active: true,
              about: '',
              photo_url: '',
              language: 'Belirtilmedi',
              education: 'Belirtilmedi',
              salary_min: 0,
              salary_max: 0,
              working_status: 'open'
            });
            window.dispatchEvent(new Event('new_cv_created'));
          }
        } catch (e) {
          console.error('Frontend fallback CV creation failed:', e);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      // Optional: Clear any local storage if you have custom keys, mostly supabase handles it.
      // Do NOT reload page, let state drive the UI.
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
