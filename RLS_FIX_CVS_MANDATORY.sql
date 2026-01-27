-- Allow anyone to read basic CV info (needed for notifications)
DROP POLICY IF EXISTS "Public can view basic cv info" ON cvs;

CREATE POLICY "Public can view basic cv info"
ON cvs FOR SELECT
USING (true);

-- Ensure authenticated users can read companies (already fixed, but reinforcing)
DROP POLICY IF EXISTS "Public can view companies" ON companies;

CREATE POLICY "Public can view companies"
ON companies FOR SELECT
USING (true);
