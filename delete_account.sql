-- Function to allow users to delete their own account
-- This function deletes data from all related tables before removing the user from auth.users
create or replace function delete_account()
returns void as $$
declare
  request_count int;
begin
  -- 1. Delete Contact Requests (where user is sender or receiver)
  -- If the table doesn't exist or is named differently, this might need adjustment.
  -- Based on App.tsx, the table is 'contact_requests'.
  begin
    delete from public.contact_requests 
    where sender_id = auth.uid() or target_user_id = auth.uid();
  exception when undefined_table then
    -- Table might not exist yet, ignore
    null;
  end;

  -- 2. Delete CV
  delete from public.cvs 
  where user_id = auth.uid();

  -- 3. Delete Profile
  delete from public.profiles 
  where id = auth.uid();

  -- 4. Delete User from Auth (This signs them out immediately)
  delete from auth.users 
  where id = auth.uid();
end;
$$ language plpgsql security definer;
