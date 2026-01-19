-- Add working_status and references columns to cvs table

ALTER TABLE cvs 
ADD COLUMN IF NOT EXISTS "working_status" TEXT DEFAULT 'open',
ADD COLUMN IF NOT EXISTS "references" JSONB DEFAULT '[]'::jsonb;

-- Comment on columns
COMMENT ON COLUMN cvs.working_status IS 'Current working status: active (Çalışıyor), passive (Çalışmıyor), open (İş Arıyor)';
COMMENT ON COLUMN cvs.references IS 'List of professional references in JSON format';
