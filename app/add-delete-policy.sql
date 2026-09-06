-- Run this once in Supabase -> SQL Editor
-- It allows logged-in admin users to delete articles
-- (your original database.sql only had policies for select, insert, and update)

create policy "Allow authenticated delete" on articles
for delete using (auth.role() = 'authenticated');
