-- Create contact_requests table
create table public.contact_requests (
  id uuid default gen_random_uuid() primary key,
  requester_id uuid references auth.users not null,
  target_user_id uuid references auth.users not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(requester_id, target_user_id)
);

-- RLS for contact_requests
alter table public.contact_requests enable row level security;

-- Requester can see their own requests
create policy "Users can view their own sent requests"
  on public.contact_requests for select
  using ( auth.uid() = requester_id );

-- Target user can see requests sent to them
create policy "Users can view requests received"
  on public.contact_requests for select
  using ( auth.uid() = target_user_id );

-- Users can create requests (except to themselves)
create policy "Users can create contact requests"
  on public.contact_requests for insert
  with check ( auth.uid() = requester_id AND auth.uid() != target_user_id );

-- Target user can update status (approve/reject)
create policy "Target users can update request status"
  on public.contact_requests for update
  using ( auth.uid() = target_user_id );

-- Helper function to check if a user has access to another user's contact info
create or replace function public.has_contact_access(target_uid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.contact_requests
    where requester_id = auth.uid()
      and target_user_id = target_uid
      and status = 'approved'
  );
end;
$$ language plpgsql security definer;
