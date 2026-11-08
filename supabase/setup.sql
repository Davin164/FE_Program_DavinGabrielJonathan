CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

DROP TABLE IF EXISTS audit_logs, attendances, registrations, events, users, divisions CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

CREATE TABLE divisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO divisions (name, description) VALUES
  ('Machine Learning', 'AI, Deep Learning, computer vision, NLP, and predictive modeling'),
  ('Cyber Security', 'Network defense, application security, ethical hacking, and digital forensics'),
  ('Game Development', 'Game design, 2D/3D graphics, Unity/Unreal mechanics, and game logic'),
  ('Mobile Development', 'Android, Kotlin, Flutter, and cross-platform mobile apps'),
  ('Web Development', 'Full-stack web applications, React, Node.js, and modern cloud stacks'),
  ('UI/UX', 'User experience research, wireframing, and Figma design systems'),
  ('Project Management', 'Agile sprints, scrum workflows, and project lifecycle management'),
  ('Human Resource', 'Member recruitment, talent development, and internal bonding'),
  ('Public Relation', 'Community outreach, partnership networking, and campus communications'),
  ('Creative Design', 'Visual assets, event branding, posters, and graphic design'),
  ('Videography', 'Video production, cinematic documentation, and motion graphics'),
  ('Copywriting', 'Content writing, social media captions, storytelling, and publications');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'MEMBER' CHECK (role IN (
    'LEAD',
    'CO_LEAD',
    'SECRETARY_1',
    'SECRETARY_2',
    'TREASURER_1',
    'TREASURER_2',
    'CORE_TEAM',
    'MEMBER'
  )),
  division_id UUID REFERENCES divisions(id),
  nim VARCHAR(20),
  phone VARCHAR(20),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_division_id ON users(division_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_deleted ON users(is_deleted);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  quota INTEGER NOT NULL CHECK (quota > 0),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location VARCHAR(255),
  created_by UUID NOT NULL REFERENCES users(id),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT end_after_start CHECK (end_time > start_time)
);

CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_events_is_deleted ON events(is_deleted);

CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_registration UNIQUE (user_id, event_id)
);

CREATE INDEX idx_registrations_user_id ON registrations(user_id);
CREATE INDEX idx_registrations_event_id ON registrations(event_id);

CREATE TABLE attendances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_attendance UNIQUE (user_id, event_id)
);

CREATE INDEX idx_attendances_user_id ON attendances(user_id);
CREATE INDEX idx_attendances_event_id ON attendances(event_id);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  target_id UUID,
  target_table VARCHAR(50),
  action VARCHAR(50) NOT NULL,
  old_value JSONB,
  new_value JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_target_id ON audit_logs(target_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Seed Initial Users (Password: Password123!)
INSERT INTO users (email, name, password_hash, role, division_id, nim, phone) VALUES
  (
    'lead.gdgoc@gmail.com',
    'Lead Admin',
    extensions.crypt('Password123!', extensions.gen_salt('bf', 12)),
    'LEAD',
    (SELECT id FROM divisions WHERE name = 'Project Management' LIMIT 1),
    '09021282100001', '081111111111'
  ),
  (
    'colead.gdgoc@gmail.com',
    'Co-Lead Admin',
    extensions.crypt('Password123!', extensions.gen_salt('bf', 12)),
    'CO_LEAD',
    (SELECT id FROM divisions WHERE name = 'Human Resource' LIMIT 1),
    '09021282100002', '081111111112'
  ),
  (
    'sec1.gdgoc@gmail.com',
    'Secretary 1',
    extensions.crypt('Password123!', extensions.gen_salt('bf', 12)),
    'SECRETARY_1',
    (SELECT id FROM divisions WHERE name = 'Public Relation' LIMIT 1),
    '09021282100003', '081111111113'
  ),
  (
    'sec2.gdgoc@gmail.com',
    'Secretary 2',
    extensions.crypt('Password123!', extensions.gen_salt('bf', 12)),
    'SECRETARY_2',
    (SELECT id FROM divisions WHERE name = 'Copywriting' LIMIT 1),
    '09021282100004', '081111111114'
  ),
  (
    'treas1.gdgoc@gmail.com',
    'Treasurer 1',
    extensions.crypt('Password123!', extensions.gen_salt('bf', 12)),
    'TREASURER_1',
    (SELECT id FROM divisions WHERE name = 'Project Management' LIMIT 1),
    '09021282100005', '081111111115'
  ),
  (
    'treas2.gdgoc@gmail.com',
    'Treasurer 2',
    extensions.crypt('Password123!', extensions.gen_salt('bf', 12)),
    'TREASURER_2',
    (SELECT id FROM divisions WHERE name = 'Public Relation' LIMIT 1),
    '09021282100006', '081111111116'
  ),
  (
    'core.tech@gmail.com',
    'Core Team (Web Dev)',
    extensions.crypt('Password123!', extensions.gen_salt('bf', 12)),
    'CORE_TEAM',
    (SELECT id FROM divisions WHERE name = 'Web Development' LIMIT 1),
    '09021282100007', '082222222222'
  ),
  (
    'core.ml@gmail.com',
    'Core Team (Machine Learning)',
    extensions.crypt('Password123!', extensions.gen_salt('bf', 12)),
    'CORE_TEAM',
    (SELECT id FROM divisions WHERE name = 'Machine Learning' LIMIT 1),
    '09021282100008', '082222222223'
  ),
  (
    'davin4@gmail.com',
    'Davin Gabriel Jonathan',
    extensions.crypt('Password123!', extensions.gen_salt('bf', 12)),
    'MEMBER',
    (SELECT id FROM divisions WHERE name = 'Web Development' LIMIT 1),
    '09021282126045', '081234567890'
  ),
  (
    'member.gdgoc@gmail.com',
    'Siti Nurhaliza',
    extensions.crypt('Password123!', extensions.gen_salt('bf', 12)),
    'MEMBER',
    (SELECT id FROM divisions WHERE name = 'UI/UX' LIMIT 1),
    '09021282126046', '081234567891'
  );

INSERT INTO events (title, description, quota, start_time, end_time, location, created_by) VALUES
  (
    'GDGoC UNSRI Kickoff & Info Session 2026',
    'Opening session for Google Developer Groups on Campus Universitas Sriwijaya divisions and roadmap.',
    100,
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '7 days' + INTERVAL '3 hours',
    'Aula Fakultas Ilmu Komputer UNSRI',
    (SELECT id FROM users WHERE email = 'lead.gdgoc@gmail.com' LIMIT 1)
  ),
  (
    'Live Technical Jam: Web & Cloud Deployment (Sesi Aktif Sekarang)',
    'Live workshop and hands-on deployment jam with Google Developer Groups on Campus UNSRI. Sesi ini sedang berlangsung untuk uji coba presensi langsung.',
    80,
    NOW() - INTERVAL '1 hour',
    NOW() + INTERVAL '3 hours',
    'Auditorium Fasilkom & Google Meet',
    (SELECT id FROM users WHERE email = 'lead.gdgoc@gmail.com' LIMIT 1)
  ),
  (
    'Google Cloud & Generative AI Workshop',
    'Practical hands-on workshop covering Gemini models and modern cloud architectures.',
    50,
    NOW() + INTERVAL '3 days',
    NOW() + INTERVAL '3 days' + INTERVAL '4 hours',
    'Auditorium Pascasarjana UNSRI & Google Meet',
    (SELECT id FROM users WHERE email = 'core.tech@gmail.com' LIMIT 1)
  ),
  (
    'UI/UX Design Sprint 2026',
    'Hands-on user research and high-fidelity prototyping session using Figma and Design Thinking.',
    30,
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '7 days' + INTERVAL '3 hours',
    'Lab Komputer 3 Fasilkom UNSRI',
    (SELECT id FROM users WHERE email = 'lead.gdgoc@gmail.com' LIMIT 1)
  );

-- SEED INITIAL AUDIT LOGS (Demonstrating Sensitive Role Changes per Case Study Spec)
INSERT INTO audit_logs (actor_id, target_id, target_table, action, old_value, new_value, created_at) VALUES
  (
    (SELECT id FROM users WHERE email = 'lead.gdgoc@gmail.com' LIMIT 1),
    (SELECT id FROM users WHERE email = 'core.tech@gmail.com' LIMIT 1),
    'users',
    'UPDATE_ROLE',
    '{"role": "MEMBER"}'::jsonb,
    '{"role": "CORE_TEAM"}'::jsonb,
    NOW() - INTERVAL '2 days'
  ),
  (
    (SELECT id FROM users WHERE email = 'lead.gdgoc@gmail.com' LIMIT 1),
    (SELECT id FROM users WHERE email = 'core.ml@gmail.com' LIMIT 1),
    'users',
    'UPDATE_ROLE',
    '{"role": "MEMBER"}'::jsonb,
    '{"role": "CORE_TEAM"}'::jsonb,
    NOW() - INTERVAL '1 day'
  ),
  (
    (SELECT id FROM users WHERE email = 'lead.gdgoc@gmail.com' LIMIT 1),
    (SELECT id FROM events WHERE title = 'Google Cloud & Generative AI Workshop' LIMIT 1),
    'events',
    'EVENT_CREATED',
    null,
    '{"title": "Google Cloud & Generative AI Workshop", "quota": 50}'::jsonb,
    NOW() - INTERVAL '12 hours'
  );

-- 7. Policy akses tabel untuk BaaS client
ALTER TABLE divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "BaaS divisions policy" ON divisions;
CREATE POLICY "BaaS divisions policy" ON divisions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "BaaS users policy" ON users;
CREATE POLICY "BaaS users policy" ON users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "BaaS events policy" ON events;
CREATE POLICY "BaaS events policy" ON events FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "BaaS registrations policy" ON registrations;
CREATE POLICY "BaaS registrations policy" ON registrations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "BaaS attendances policy" ON attendances;
CREATE POLICY "BaaS attendances policy" ON attendances FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "BaaS audit_logs policy" ON audit_logs;
CREATE POLICY "BaaS audit_logs policy" ON audit_logs FOR ALL USING (true) WITH CHECK (true);


-- Aturan bisnis database (enforce kuota dan jadwal absensi)

-- 1) KUOTA EVENT TIDAK BOLEH TERLAMPAUI (aman untuk request bersamaan)
--    SELECT ... FOR UPDATE mengunci baris event, sehingga dua pendaftar yang
--    berebut slot terakhir diproses berurutan: yang kedua melihat kuota penuh.
CREATE OR REPLACE FUNCTION enforce_event_quota()
RETURNS TRIGGER AS $$
DECLARE
  v_quota   INTEGER;
  v_deleted BOOLEAN;
  v_count   INTEGER;
BEGIN
  SELECT quota, is_deleted INTO v_quota, v_deleted
  FROM events WHERE id = NEW.event_id FOR UPDATE;

  IF NOT FOUND OR v_deleted THEN
    RAISE EXCEPTION 'Event not found or has been canceled';
  END IF;

  SELECT COUNT(*) INTO v_count FROM registrations WHERE event_id = NEW.event_id;

  IF v_count >= v_quota THEN
    RAISE EXCEPTION 'Registration failed: Event quota is full';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_enforce_event_quota ON registrations;
CREATE TRIGGER trg_enforce_event_quota
  BEFORE INSERT ON registrations
  FOR EACH ROW EXECUTE FUNCTION enforce_event_quota();

-- 2) ABSENSI HANYA VALID PADA JENDELA WAKTU EVENT
CREATE OR REPLACE FUNCTION enforce_attendance_window()
RETURNS TRIGGER AS $$
DECLARE
  v_start   TIMESTAMPTZ;
  v_end     TIMESTAMPTZ;
  v_deleted BOOLEAN;
BEGIN
  SELECT start_time, end_time, is_deleted INTO v_start, v_end, v_deleted
  FROM events WHERE id = NEW.event_id;

  IF NOT FOUND OR v_deleted THEN
    RAISE EXCEPTION 'Event not found or has been removed';
  END IF;

  IF NOW() < v_start THEN
    RAISE EXCEPTION 'Sesi absensi belum dibuka. Absensi hanya dapat dilakukan saat jadwal event berlangsung.';
  END IF;

  IF NOW() > v_end THEN
    RAISE EXCEPTION 'Sesi absensi untuk event ini telah berakhir.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_enforce_attendance_window ON attendances;
CREATE TRIGGER trg_enforce_attendance_window
  BEFORE INSERT ON attendances
  FOR EACH ROW EXECUTE FUNCTION enforce_attendance_window();

