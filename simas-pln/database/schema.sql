-- =====================================================
-- SIMAS - Sistem Informasi Manajemen Aset
-- PLN Icon Plus
-- Jalankan file SQL ini di Supabase SQL Editor
-- =====================================================

-- 1. TABEL KATEGORI
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL LOKASI
CREATE TABLE IF NOT EXISTS locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL ASET (UTAMA)
CREATE TABLE IF NOT EXISTS assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  serial_number VARCHAR(100) UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Tersedia' CHECK (status IN ('Tersedia', 'Digunakan', 'Rusak')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL RIWAYAT / LOG ASET
CREATE TABLE IF NOT EXISTS asset_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  asset_name VARCHAR(200),
  serial_number VARCHAR(100),
  action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data JSONB,
  new_data JSONB,
  changed_by VARCHAR(100) DEFAULT 'System',
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TRIGGER: Otomatis catat riwayat setiap ada perubahan
-- =====================================================

-- Fungsi trigger
CREATE OR REPLACE FUNCTION log_asset_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO asset_logs (asset_id, asset_name, serial_number, action, old_data, new_data)
    VALUES (NEW.id, NEW.name, NEW.serial_number, 'INSERT', NULL, row_to_json(NEW)::JSONB);
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO asset_logs (asset_id, asset_name, serial_number, action, old_data, new_data)
    VALUES (NEW.id, NEW.name, NEW.serial_number, 'UPDATE', row_to_json(OLD)::JSONB, row_to_json(NEW)::JSONB);
    -- Update timestamp otomatis
    NEW.updated_at = NOW();
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO asset_logs (asset_id, asset_name, serial_number, action, old_data, new_data)
    VALUES (OLD.id, OLD.name, OLD.serial_number, 'DELETE', row_to_json(OLD)::JSONB, NULL);
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Pasang trigger ke tabel assets
CREATE OR REPLACE TRIGGER assets_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON assets
  FOR EACH ROW EXECUTE FUNCTION log_asset_changes();

-- =====================================================
-- DATA AWAL (SEED DATA) - Contoh untuk testing
-- =====================================================

-- Kategori
INSERT INTO categories (name, description) VALUES
  ('Router', 'Perangkat jaringan untuk routing data'),
  ('Switch', 'Perangkat jaringan untuk switching'),
  ('Server', 'Server fisik dan blade server'),
  ('Kabel', 'Kabel jaringan fiber dan UTP'),
  ('UPS', 'Uninterruptible Power Supply')
ON CONFLICT (name) DO NOTHING;

-- Lokasi
INSERT INTO locations (name, address) VALUES
  ('Gudang A', 'Jl. Gatot Subroto No. 1, Jakarta'),
  ('Kantor Pusat', 'Jl. Gatot Subroto No. 1, Jakarta Selatan'),
  ('Site Bandung', 'Jl. Asia Afrika No. 8, Bandung'),
  ('Site Surabaya', 'Jl. Pemuda No. 5, Surabaya')
ON CONFLICT (name) DO NOTHING;

-- Contoh Aset
INSERT INTO assets (name, serial_number, category_id, location_id, status, notes)
SELECT
  'Router Cisco ISR 4321',
  'CSC-ISR4321-001',
  (SELECT id FROM categories WHERE name = 'Router'),
  (SELECT id FROM locations WHERE name = 'Gudang A'),
  'Tersedia',
  'Kondisi baik, baru keluar dari gudang'
WHERE NOT EXISTS (SELECT 1 FROM assets WHERE serial_number = 'CSC-ISR4321-001');

INSERT INTO assets (name, serial_number, category_id, location_id, status, notes)
SELECT
  'Switch HP ProCurve 2920',
  'HP-2920-002',
  (SELECT id FROM categories WHERE name = 'Switch'),
  (SELECT id FROM locations WHERE name = 'Kantor Pusat'),
  'Digunakan',
  'Terpasang di rack server lantai 3'
WHERE NOT EXISTS (SELECT 1 FROM assets WHERE serial_number = 'HP-2920-002');

INSERT INTO assets (name, serial_number, category_id, location_id, status, notes)
SELECT
  'Server Dell PowerEdge R740',
  'DELL-R740-003',
  (SELECT id FROM categories WHERE name = 'Server'),
  (SELECT id FROM locations WHERE name = 'Site Bandung'),
  'Digunakan',
  'Server produksi utama'
WHERE NOT EXISTS (SELECT 1 FROM assets WHERE serial_number = 'DELL-R740-003');

INSERT INTO assets (name, serial_number, category_id, location_id, status, notes)
SELECT
  'UPS APC Smart-UPS 3000',
  'APC-SU3000-004',
  (SELECT id FROM categories WHERE name = 'UPS'),
  (SELECT id FROM locations WHERE name = 'Site Surabaya'),
  'Rusak',
  'Baterai perlu penggantian'
WHERE NOT EXISTS (SELECT 1 FROM assets WHERE serial_number = 'APC-SU3000-004');

-- =====================================================
-- VIEWS (Opsional - memudahkan query)
-- =====================================================

CREATE OR REPLACE VIEW assets_detail AS
SELECT 
  a.id,
  a.name,
  a.serial_number,
  a.status,
  a.notes,
  a.created_at,
  a.updated_at,
  c.name AS category_name,
  l.name AS location_name
FROM assets a
LEFT JOIN categories c ON a.category_id = c.id
LEFT JOIN locations l ON a.location_id = l.id;

-- =====================================================
-- ROW LEVEL SECURITY (Opsional, aktifkan jika pakai auth)
-- =====================================================
-- ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE asset_logs ENABLE ROW LEVEL SECURITY;
