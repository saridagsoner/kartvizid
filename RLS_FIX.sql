-- Enable reading profiles for everyone
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);

-- Enable reading companies for everyone
DROP POLICY IF EXISTS "Companies are viewable by everyone" ON companies;
CREATE POLICY "Companies are viewable by everyone" ON companies FOR SELECT USING (true);

-- Enable reading CVs for everyone
DROP POLICY IF EXISTS "CVs are viewable by everyone" ON cvs;
CREATE POLICY "CVs are viewable by everyone" ON cvs FOR SELECT USING (true);
