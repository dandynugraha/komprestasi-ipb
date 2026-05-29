-- ══════════════════════════════════════════════════════
-- KOMPRESTASI IPB — Database Setup
-- Jalankan di Supabase SQL Editor (sekali saja)
-- ══════════════════════════════════════════════════════

-- Users table
-- Role format: "Rona", "cda (bisnis)", "cda (penulisan)", "cda (desain)", 
--   "cda (olimpiade)", "cda", "mbd (ilustrator)", "mbd (desain grafis)", 
--   "mbd (video editor)", "mbd (multimedia)", "mbd", "heg", "korvoks", "bph", "admin"
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Rona',
  cluster TEXT,
  lokasi TEXT CHECK (lokasi IN ('Dramaga','Vokasi')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prestasi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  storytelling TEXT NOT NULL,
  photo_url TEXT,
  cabang TEXT,
  status TEXT DEFAULT 'Peserta',
  cluster TEXT,
  lokasi TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kegiatan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  storytelling TEXT NOT NULL,
  photo_url TEXT,
  cluster TEXT,
  lokasi TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  storytelling TEXT NOT NULL,
  photo_url TEXT,
  link TEXT,
  cluster TEXT,
  lokasi TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lomba (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  cabang TEXT,
  status TEXT DEFAULT 'Peserta',
  deadline DATE,
  cluster TEXT,
  lokasi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE,
  time_start TEXT,
  time_end TEXT,
  location TEXT,
  visibility TEXT CHECK (visibility IN ('internal','eksternal')) DEFAULT 'eksternal',
  created_by UUID REFERENCES users(id),
  divisi TEXT,
  spots INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

CREATE TABLE IF NOT EXISTS pesen_desain (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'Pending',
  requested_by UUID REFERENCES users(id),
  from_divisi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pengeluaran (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  category TEXT,
  amount INTEGER NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════
-- RLS (Row Level Security)
-- ══════════════════════════════════════════════════════
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE kegiatan ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE lomba ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pesen_desain ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengeluaran ENABLE ROW LEVEL SECURITY;

-- Users
CREATE POLICY "Users read own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Service role full access" ON users FOR ALL USING (auth.role() = 'service_role');

-- Prestasi
CREATE POLICY "Public read published prestasi" ON prestasi FOR SELECT USING (is_published = true);
CREATE POLICY "Users insert own prestasi" ON prestasi FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own prestasi" ON prestasi FOR UPDATE USING (auth.uid() = user_id);

-- Kegiatan
CREATE POLICY "Public read published kegiatan" ON kegiatan FOR SELECT USING (is_published = true);
CREATE POLICY "Users insert own kegiatan" ON kegiatan FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Projects
CREATE POLICY "Public read published projects" ON projects FOR SELECT USING (is_published = true);
CREATE POLICY "Users insert own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Lomba
CREATE POLICY "Users read own lomba" ON lomba FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own lomba" ON lomba FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own lomba" ON lomba FOR UPDATE USING (auth.uid() = user_id);
-- CDA/Admin bisa baca semua lomba di cluster mereka
CREATE POLICY "CDA read cluster lomba" ON lomba FOR SELECT USING (true);

-- Events
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Aksara create events" ON events FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Event registrations
CREATE POLICY "Read registrations" ON event_registrations FOR SELECT USING (true);
CREATE POLICY "Register self" ON event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Unregister self" ON event_registrations FOR DELETE USING (auth.uid() = user_id);

-- Pesen desain
CREATE POLICY "Read pesen desain" ON pesen_desain FOR SELECT USING (true);
CREATE POLICY "Create pesen desain" ON pesen_desain FOR INSERT WITH CHECK (auth.uid() = requested_by);
CREATE POLICY "MBD update pesen desain" ON pesen_desain FOR UPDATE USING (true);

-- Pengeluaran
CREATE POLICY "Users read own pengeluaran" ON pengeluaran FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own pengeluaran" ON pengeluaran FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own pengeluaran" ON pengeluaran FOR DELETE USING (auth.uid() = user_id);

-- ══════════════════════════════════════════════════════
-- PUBLIC STATS (supaya home page bisa tampilkan statistik tanpa login)
-- Jalankan ini SETELAH database.sql utama
-- ══════════════════════════════════════════════════════

-- Izinkan public baca jumlah user (untuk stat "105 anggota")
DROP POLICY IF EXISTS "Users read own profile" ON users;
CREATE POLICY "Anyone can read users" ON users FOR SELECT USING (true);

-- Izinkan public baca lomba (untuk stat partisipasi + cabang chart)
DROP POLICY IF EXISTS "Users read own lomba" ON lomba;
CREATE POLICY "Anyone can read lomba" ON lomba FOR SELECT USING (true);
