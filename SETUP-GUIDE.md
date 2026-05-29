# Panduan Setup Komprestasi IPB Web System

## Apa yang kamu butuhkan sebelum mulai

- **Node.js v18+** → download di nodejs.org
- **Akun GitHub** → untuk hosting website
- **Akun Supabase** → gratis di supabase.com (backend & database)
- **Text Editor** → VS Code direkomendasikan
- **File project** → `komprestasi-ipb-v2.tar.gz` yang sudah kamu download

---

## Step 1 — Extract Project & Install Dependencies

Buka Terminal (Mac) atau Command Prompt (Windows), navigasi ke folder tempat file tar.gz berada, lalu jalankan:

```
tar xzf komprestasi-ipb-v2.tar.gz
cd komprestasi-ipb
npm install
```

Kalau pakai Windows dan tidak bisa `tar`, extract pakai 7-Zip atau WinRAR.

`npm install` akan download semua library yang dibutuhkan (React, Tailwind, Supabase, Framer Motion, dll). Proses ini butuh waktu 1-3 menit tergantung koneksi internet.

**Kalau berhasil:** akan muncul folder `node_modules/` di dalam project.

---

## Step 2 — Buat Project Supabase

1. Buka **supabase.com** → Sign Up atau Login
2. Klik **New Project**
3. Isi form:
   - **Organization:** pilih yang ada atau buat baru
   - **Project name:** `komprestasi-ipb`
   - **Database password:** buat password kuat (simpan, nanti dibutuhkan)
   - **Region:** pilih **Southeast Asia (Singapore)** supaya cepat
4. Klik **Create new project** → tunggu ~2 menit sampai selesai
5. Setelah jadi, buka **Settings → API** (di sidebar kiri bawah)
6. Catat 3 hal ini:
   - **Project URL** → contoh: `https://abcdefg.supabase.co`
   - **anon public key** → key panjang yang dimulai `eyJhbGciOi...`
   - **service_role key** (klik reveal) → key secret, JANGAN share ke siapapun

---

## Step 3 — Setup Database (Buat Tabel)

1. Di Supabase dashboard, buka **SQL Editor** (icon di sidebar kiri)
2. Klik **New Query**
3. Buka file `scripts/database.sql` dari project kamu
4. Copy SELURUH isi file tersebut
5. Paste ke SQL Editor
6. Klik **Run** (tombol hijau)

**Kalau berhasil:** akan muncul "Success. No rows returned" — ini normal karena kita membuat tabel, bukan query data.

**Untuk verifikasi:** buka **Table Editor** di sidebar → kamu harus lihat tabel: users, prestasi, kegiatan, projects, lomba, events, event_registrations, pesen_desain, pengeluaran.

---

## Step 4 — Setup Supabase Auth & Storage

### Auth (supaya user bisa login):
1. Di Supabase, buka **Authentication → Providers**
2. Pastikan **Email** sudah enabled (biasanya default on)
3. Di **Authentication → Settings**:
   - **Confirm email:** matikan (OFF) → supaya user bisa langsung login tanpa konfirmasi email
   - **Secure email change:** biarkan default

### Storage (supaya user bisa upload foto):
1. Buka **Storage** di sidebar
2. Klik **New Bucket**
3. Nama: `uploads`
4. Centang **Public bucket** → ON
5. Klik **Create bucket**
6. Klik bucket `uploads` → **Policies** → **New Policy** → **For full customization**
7. Buat policy:
   - **Policy name:** `Allow authenticated uploads`
   - **Allowed operations:** SELECT, INSERT
   - **Target roles:** authenticated
   - **USING expression:** `true`
   - **WITH CHECK expression:** `true`
8. Klik **Save**

---

## Step 5 — Isi Config File

Buka file `src/config/site.config.js` dengan text editor, cari bagian `supabase`:

```javascript
supabase: {
  url: "https://YOUR_PROJECT.supabase.co",      // ← GANTI dengan Project URL dari Step 2
  anonKey: "YOUR_ANON_KEY",                       // ← GANTI dengan anon public key dari Step 2
},
```

Ganti kedua value tersebut dengan yang kamu catat di Step 2. Simpan file.

---

## Step 6 — Import 105 User (Seed Data)

Ini step paling penting — memasukkan semua data login dari Excel ke Supabase.

1. Buka file `scripts/seed-users.mjs` dengan text editor
2. Ganti 2 baris di atas:

```javascript
const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";      // ← GANTI
const SERVICE_ROLE_KEY = "eyJhbGciOi...YOUR_SERVICE_ROLE...";  // ← GANTI dengan service_role key (yang SECRET)
```

3. **PENTING:** Cari baris Aisha Rachmania yang emailnya `GANTI_EMAIL_AISHA@gmail.com` → ganti ke email asli Aisha (karena di Excel emailnya sama dengan Agni Meidinna — ini harus berbeda)

4. Jalankan di terminal:

```
node scripts/seed-users.mjs
```

5. Tunggu sampai selesai (~30 detik). Output yang benar:

```
🚀 Seeding 105 users...

  ✅ 105/105 — Adela Anur Faindah

✅ Berhasil: 105  ❌ Gagal: 0
```

**Apa yang terjadi di balik layar:**
- Script membuat 105 **akun login** di Supabase Auth (email + password)
- Script juga mengisi tabel **users** dengan profil lengkap (nama, role, cluster, lokasi)
- Email confirmation di-skip otomatis → user bisa langsung login
- Password sesuai Excel: Rona pakai `RONA622501` dst, Aksara pakai `AKSARA6281` dst

**Kalau ada yang gagal:** cek error message-nya. Biasanya karena:
- Email duplikat (Aisha belum diganti)
- Service role key salah
- Tabel users belum dibuat (Step 3 belum dijalankan)

**Untuk verifikasi:** buka Supabase → **Authentication → Users** → harus ada 105 user. Buka juga **Table Editor → users** → harus ada 105 row dengan data lengkap.

---

## Step 7 — Test di Lokal

```
npm run dev
```

Buka browser ke `http://localhost:5173/komprestasi-ipb/`

**Yang harus kamu lihat:**
1. **Splash screen** — logo ungu-biru dengan animasi ring, particles, loading bar (~4 detik)
2. **Home page** — hero bold purple dengan "Komunitas Prestasi IPB", stat cards, empty state sections
3. **Login** — coba login pakai salah satu akun, misalnya:
   - Email: `ervinahendrwt@gmail.com` / Password: `RONA622501` (Rona, Bisnis, Dramaga)
   - Email: `audiamaharani@apps.ipb.ac.id` / Password: `AKSARA6281` (CDA Bisnis)
   - Email: `naila007nabila@apps.ipb.ac.id` / Password: `AKSARA6287` (MBD Ilustrator)
   - Email: `hasnasalsabilla@apps.ipb.ac.id` / Password: `AKSARA6292` (HEG)
   - Email: `brawijayapratama@apps.ipb.ac.id` / Password: `AKSARA62102` (BPH)
4. **Dashboard** — setelah login, cek apakah greeting card benar (nama, cluster, lokasi), sidebar menu sesuai role

**Kalau login gagal:** pastikan Step 4 (matikan Confirm email) dan Step 6 (seed) sudah benar.

---

## Step 8 — Buat Repository GitHub

1. Buka github.com → **New Repository**
2. Repository name: `komprestasi-ipb`
3. Visibility: **Public** (wajib untuk GitHub Pages gratis)
4. Jangan centang apapun (no README, no .gitignore)
5. Klik **Create repository**

Di terminal project kamu:

```
git init
git add .
git commit -m "Initial commit - Komprestasi IPB"
git branch -M main
git remote add origin https://github.com/USERNAME/komprestasi-ipb.git
git push -u origin main
```

Ganti `USERNAME` dengan GitHub username kamu.

---

## Step 9 — Deploy ke GitHub Pages

1. Install gh-pages:

```
npm install gh-pages --save-dev
```

2. Buka `package.json`, tambah di dalam `"scripts"`:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

3. Deploy:

```
npm run deploy
```

4. Tunggu ~1 menit, lalu buka:

```
https://USERNAME.github.io/komprestasi-ipb/
```

5. **Kalau halaman 404:** buka GitHub repo → **Settings → Pages** → pastikan:
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** / **(root)**
   - Klik Save

---

## Selesai! 🎉

Website kamu sudah live. Semua 105 anggota bisa login dengan email + password dari data Excel.

### Ringkasan akses:

| Role | Contoh | Bisa apa |
|------|--------|----------|
| **Rona** (80 orang) | RONA622501 dst | Upload prestasi/kegiatan/project, tracking lomba, jadwal, pengeluaran |
| **CDA** (6 orang) | AKSARA6281-6286 | Semua fitur Rona + dashboard CDA (lihat upload dari cluster) |
| **MBD** (5 orang) | AKSARA6287-6291 | Semua fitur Rona + kanban pesen desain |
| **HEG** (5 orang) | AKSARA6292-6296 | Semua fitur Rona + dashboard registrasi & skor |
| **Korvoks** (5 orang) | AKSARA6297-62101 | Semua fitur Rona + dashboard Vokasi |
| **BPH** (4 orang) | AKSARA62102-62105 | Semua fitur Rona + read-only feed semua divisi |

### Kalau mau update website nanti:

```
# Edit code → test lokal
npm run dev

# Push perubahan ke live
npm run deploy
```
