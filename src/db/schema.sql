\c batistack_dev;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DROP TABLE IF EXISTS guests;
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(150) NOT NULL,

  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  attendance VARCHAR(20) NOT NULL DEFAULT 'both',

  has_plus_one BOOLEAN NOT NULL DEFAULT false,
  plus_one_name VARCHAR(150),

  responded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


ALTER TABLE guests
ADD COLUMN IF NOT EXISTS attendance VARCHAR(20) NOT NULL DEFAULT 'both';


ALTER TABLE guests
DROP CONSTRAINT IF EXISTS guests_status_check;

ALTER TABLE guests
ADD CONSTRAINT guests_status_check
CHECK (status IN ('pending', 'confirmed', 'declined'));

ALTER TABLE guests
DROP CONSTRAINT IF EXISTS guests_attendance_check;

ALTER TABLE guests
ADD CONSTRAINT guests_attendance_check
CHECK (attendance IN ('ceremony', 'celebration', 'both'));


CREATE INDEX IF NOT EXISTS idx_guests_status ON guests(status);
CREATE INDEX IF NOT EXISTS idx_guests_attendance ON guests(attendance);
