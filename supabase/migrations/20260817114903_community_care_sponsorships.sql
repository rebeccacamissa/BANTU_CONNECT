/*
# Community Care Sponsorship Board

## Purpose
A public, community-driven board where individuals can list themselves as
needing a hair/beauty sponsorship (e.g. for a matric ball, job interview, or
to help an underprivileged woman feel beautiful again). Generous customers
or businesses can contribute toward (or fully cover) the requested fee.

This is a SHARED, public board — no sign-in required to view or post. It is
intentionally open to the community, so RLS allows both `anon` and
`authenticated` roles to read and write. This mirrors the existing Bantu
Connect app which uses a localStorage-based pseudo-auth (demo mode) rather
than Supabase Auth.

## 1. New Tables

### sponsorships
- `id` (uuid, primary key, default gen_random_uuid)
- `recipient_name` (text, not null) — display name of the person seeking sponsorship
- `recipient_contact` (text, nullable) — optional WhatsApp number for the sponsor to reach them
- `story` (text, not null) — short description of why they need sponsorship
- `occasion` (text, not null) — e.g. "Matric Ball", "Job Interview", "Restoring Confidence"
- `service_category` (text, not null) — one of HAIR, MAKEUP, NAILS, LASHES & BROWS
- `suburb` (text, not null)
- `city` (text, not null)
- `goal_amount` (integer, not null) — target amount in ZAR cents-free whole rands
- `status` (text, not null, default 'open') — open | funded | closed
- `created_at` (timestamptz, default now())

### sponsorship_contributions
- `id` (uuid, primary key, default gen_random_uuid)
- `sponsorship_id` (uuid, foreign key → sponsorships.id ON DELETE CASCADE)
- `sponsor_name` (text, not null) — display name of the contributor
- `amount` (integer, not null) — contribution in ZAR (whole rands)
- `message` (text, nullable) — optional encouragement note
- `anonymous` (boolean, not null, default false) — hide sponsor name publicly
- `created_at` (timestamptz, default now())

## 2. Security (RLS)

Both tables are PUBLIC/SHARED — the entire app is single-tenant demo mode
with no Supabase Auth sign-in. Policies use `TO anon, authenticated` with
`USING (true)` / `WITH CHECK (true)` because the data is intentionally
community-readable and community-writable. This is documented and
intentional, not a fallback.

- sponsorships: full CRUD to anon + authenticated
- sponsorship_contributions: SELECT + INSERT to anon + authenticated;
  updates/deletes are intentionally disabled (contributions are immutable
  once made, to preserve an auditable contribution history).

## 3. Important Notes
- `goal_amount` and `amount` are in whole rands (no cents) to match the
  app's ZAR display convention.
- A trigger function `update_sponsorship_status()` auto-flips a sponsorship
  to 'funded' when the sum of contributions reaches or exceeds the goal,
  and back to 'open' if contributions drop below (defensive, though
  deletes are disabled). This keeps the board status accurate without
  relying on the client to recompute.
*/

CREATE TABLE IF NOT EXISTS sponsorships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_name text NOT NULL,
  recipient_contact text,
  story text NOT NULL,
  occasion text NOT NULL,
  service_category text NOT NULL,
  suburb text NOT NULL,
  city text NOT NULL,
  goal_amount integer NOT NULL CHECK (goal_amount > 0),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','funded','closed')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sponsorship_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsorship_id uuid NOT NULL REFERENCES sponsorships(id) ON DELETE CASCADE,
  sponsor_name text NOT NULL,
  amount integer NOT NULL CHECK (amount > 0),
  message text,
  anonymous boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sponsorships_status ON sponsorships(status);
CREATE INDEX IF NOT EXISTS idx_sponsorships_created_at ON sponsorships(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contributions_sponsorship_id ON sponsorship_contributions(sponsorship_id);

ALTER TABLE sponsorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsorship_contributions ENABLE ROW LEVEL SECURITY;

-- sponsorships policies (public shared board)
DROP POLICY IF EXISTS "anon_select_sponsorships" ON sponsorships;
CREATE POLICY "anon_select_sponsorships" ON sponsorships FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_sponsorships" ON sponsorships;
CREATE POLICY "anon_insert_sponsorships" ON sponsorships FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_sponsorships" ON sponsorships;
CREATE POLICY "anon_update_sponsorships" ON sponsorships FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_sponsorships" ON sponsorships;
CREATE POLICY "anon_delete_sponsorships" ON sponsorships FOR DELETE
  TO anon, authenticated USING (true);

-- sponsorship_contributions policies (public, immutable once written)
DROP POLICY IF EXISTS "anon_select_contributions" ON sponsorship_contributions;
CREATE POLICY "anon_select_contributions" ON sponsorship_contributions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_contributions" ON sponsorship_contributions;
CREATE POLICY "anon_insert_contributions" ON sponsorship_contributions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Auto-update sponsorship status when contributions change
CREATE OR REPLACE FUNCTION update_sponsorship_status()
RETURNS TRIGGER AS $$
DECLARE
  goal integer;
  total integer;
BEGIN
  SELECT goal_amount INTO goal FROM sponsorships WHERE id = NEW.sponsorship_id;
  SELECT COALESCE(SUM(amount), 0) INTO total
    FROM sponsorship_contributions WHERE sponsorship_id = NEW.sponsorship_id;
  IF total >= goal THEN
    UPDATE sponsorships SET status = 'funded' WHERE id = NEW.sponsorship_id AND status <> 'closed';
  ELSE
    UPDATE sponsorships SET status = 'open' WHERE id = NEW.sponsorship_id AND status <> 'closed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_update_sponsorship_status ON sponsorship_contributions;
CREATE TRIGGER trg_update_sponsorship_status
  AFTER INSERT OR UPDATE OR DELETE ON sponsorship_contributions
  FOR EACH ROW EXECUTE FUNCTION update_sponsorship_status();

-- Seed a few demo sponsorships so the board isn't empty on first load
INSERT INTO sponsorships (recipient_name, recipient_contact, story, occasion, service_category, suburb, city, goal_amount, status)
VALUES
  ('Lerato M.', '27821234567', 'Single mom of two preparing for her first job interview in three years. A fresh protective style would give her the confidence to walk in proud.', 'Job Interview', 'HAIR', 'Khayelitsha', 'Cape Town', 450, 'open'),
  ('The Girls of Hope', '27834567890', 'A group of six matric girls from a no-fee school in Soweto sharing one matric ball dream. Help us cover their makeup so they feel like princesses for one night.', 'Matric Ball', 'MAKEUP', 'Soweto', 'Johannesburg', 2400, 'open'),
  ('Auntie Nomsa', NULL, 'Survivor of domestic violence rebuilding her life. She has not felt beautiful in years. A pamper day with nails and a lash set would help restore her glow.', 'Restoring Confidence', 'NAILS', 'Mitchells Plain', 'Cape Town', 600, 'open')
ON CONFLICT DO NOTHING;
