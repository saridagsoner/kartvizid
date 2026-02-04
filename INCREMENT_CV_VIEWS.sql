-- Create a secure function to increment views
CREATE OR REPLACE FUNCTION increment_cv_views(target_cv_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE cvs
  SET views = COALESCE(views, 0) + 1
  WHERE id = target_cv_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated and anon users (if public viewing is allowed)
GRANT EXECUTE ON FUNCTION increment_cv_views(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_cv_views(UUID) TO anon;
