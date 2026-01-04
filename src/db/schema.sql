\c batistack_dev;


CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(150) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  responded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE guests
ADD CONSTRAINT guests_status_check
CHECK (status IN ('pending', 'confirmed', 'declined'));

ALTER TABLE guests
ADD COLUMN has_plus_one BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN plus_one_name VARCHAR(150);
CREATE INDEX idx_guests_status ON guests(status);
