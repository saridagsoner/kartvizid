-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvs ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES POLICIES
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. COMPANIES POLICIES
DROP POLICY IF EXISTS "Companies are viewable by everyone" ON companies;
DROP POLICY IF EXISTS "Users can insert their own company" ON companies;
DROP POLICY IF EXISTS "Users can update own company" ON companies;
DROP POLICY IF EXISTS "Users can delete own company" ON companies;

CREATE POLICY "Companies are viewable by everyone" ON companies FOR SELECT USING (true);
CREATE POLICY "Users can insert their own company" ON companies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own company" ON companies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own company" ON companies FOR DELETE USING (auth.uid() = user_id);

-- 3. CVS POLICIES
DROP POLICY IF EXISTS "CVs are viewable by everyone" ON cvs;
DROP POLICY IF EXISTS "Users can insert their own cv" ON cvs;
DROP POLICY IF EXISTS "Users can update own cv" ON cvs;
DROP POLICY IF EXISTS "Users can delete own cv" ON cvs;

-- Note: Assuming 'user_id' based on typical schema. If column is 'userId', this will fail. 
-- Verified existing RLS scripts (RLS_FIX.sql) used 'cvs', and App.tsx maps result to 'userId'.
-- However, standard Supabase is snake_case.
CREATE POLICY "CVs are viewable by everyone" ON cvs FOR SELECT USING (true);
CREATE POLICY "Users can insert their own cv" ON cvs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cv" ON cvs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cv" ON cvs FOR DELETE USING (auth.uid() = user_id);
