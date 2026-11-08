-- GDGoC UNSRI - Aturan bisnis database (idempoten)
-- Menjaga kuota pendaftaran dan jadwal absensi langsung di level PostgreSQL.

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

