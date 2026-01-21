-- 1. Update the function (Sorting by newest first)
CREATE OR REPLACE FUNCTION get_popular_companies()
RETURNS TABLE (
  id uuid,
  company_name text,
  industry text,
  logo_url text,
  interaction_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.company_name,
    c.industry,
    c.logo_url,
    COUNT(cr.id) as interaction_count
  FROM companies c
  LEFT JOIN contact_requests cr ON c.user_id = cr.requester_id
  GROUP BY c.id, c.company_name, c.industry, c.logo_url, c.created_at
  ORDER BY interaction_count DESC, c.created_at DESC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql;

-- 2. ROBUST CLEANUP: Keep ONLY the most recent profile for each user
-- This handles cases where creation times might be identical
DELETE FROM companies
WHERE id IN (
    SELECT id
    FROM (
        SELECT id,
        ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rnum
        FROM companies
    ) t
    WHERE t.rnum > 1
);

-- 3. Now safe to add variables constraint
ALTER TABLE companies ADD CONSTRAINT unique_user_company UNIQUE (user_id);
