-- Function to increment CV view count
-- specific to a CV ID
-- security definer allows it to run with privileges of the creator (bypassing RLS for this specific action)

create or replace function increment_cv_view(cv_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.cvs
  set views = coalesce(views, 0) + 1
  where id = cv_id;
end;
$$;
