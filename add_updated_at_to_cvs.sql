-- Add updated_at column to cvs table if it doesn't exist
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Create a function to automatically update the timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()    
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;   
END;
$$ language 'plpgsql';

-- Create the trigger to fire before any update on cvs table
DROP TRIGGER IF EXISTS on_cv_updated ON cvs;
CREATE TRIGGER on_cv_updated
    BEFORE UPDATE ON cvs
    FOR EACH ROW
    EXECUTE PROCEDURE handle_updated_at();
