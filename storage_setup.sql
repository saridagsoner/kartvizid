-- Create a public bucket named 'cv-photos'
insert into storage.buckets (id, name, public)
values ('cv-photos', 'cv-photos', true);

-- Policy to allow authenticated users to upload images to 'cv-photos'
create policy "Authenticated users can upload CV photos"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'cv-photos' );

-- Policy to allow public to view images in 'cv-photos'
create policy "Public can view CV photos"
on storage.objects for select
to public
using ( bucket_id = 'cv-photos' );

-- Policy to allow users to update their own photos
create policy "Users can update their own CV photos"
on storage.objects for update
to authenticated
using ( bucket_id = 'cv-photos' AND auth.uid() = owner );

-- Policy to allow users to delete their own photos
create policy "Users can delete their own CV photos"
on storage.objects for delete
to authenticated
using ( bucket_id = 'cv-photos' AND auth.uid() = owner );
