Project React+Vite web organisasi "Komprestasi IPB". Backend Supabase. Client: src/lib/supabase.js. Auth: src/context/AuthContext.jsx.

JANGAN ubah yang sudah berfungsi benar. HANYA fix/tambah yang diminta.

Tabel lomba sekarang punya kolom baru: tanggal_lomba (DATE)
Tabel prestasi sekarang punya kolom baru: tanggal_prestasi (DATE)

## TASK 1: Ganti semua "My" jadi bahasa Indonesia formal
Cari dan ganti di SELURUH project (semua file .jsx):

- "My Lomba" → "Lomba Saya"
- "My Jadwal" → "Jadwal Saya"
- "My Pengeluaran" → "Pengeluaran Saya"
- "My Event" → "Event Saya"
- "My Uploads" → "Upload Saya"
- "my lomba" → "lomba saya"
- "my jadwal" → "jadwal saya"
- "my pengeluaran" → "pengeluaran saya"
- "my event" → "event saya"
- "my uploads" → "upload saya"

Cek di semua file: DashboardLayout.jsx (sidebar menu labels), DashboardHome.jsx, MyLombaPage.jsx, MyJadwalPage.jsx, MyPengeluaranPage.jsx, MyEventPage.jsx, HomePage.jsx, dan file lain yang mengandung teks "My".

JANGAN ganti nama file atau import path — hanya ganti teks yang ditampilkan ke user (label, heading, placeholder).

## TASK 2: Tambah field "Tanggal Lomba" di Lomba Saya
File: src/pages/rona/MyLombaPage.jsx

Di form "Tambah Lomba", tambah field baru:
- Label: "Tanggal Lomba"
- Type: date input
- Placeholder: tanggal kapan mengikuti lomba
- Simpan ke kolom tanggal_lomba saat INSERT ke tabel lomba
- Tampilkan tanggal lomba di card list lomba (format: "12 Jan 2026")
- Posisi field: setelah field "Cabang", sebelum field "Status"

## TASK 3: Tambah field "Tanggal Prestasi" di Upload Prestasi
File: src/pages/rona/UploadPage.jsx

Di form upload prestasi (typeConfig.prestasi), tambah field baru:
- Label: "Tanggal Prestasi"
- Type: date input
- Placeholder: tanggal kapan meraih prestasi
- Simpan ke kolom tanggal_prestasi saat INSERT ke tabel prestasi
- Posisi field: setelah field "Cabang", sebelum field "Status"
- HANYA tampil untuk type "prestasi", TIDAK untuk kegiatan atau project

## TASK 4: Supervisor ketiga — tambah di About Us
File: src/pages/public/AboutPage.jsx

Di section Supervisors, tambah 1 supervisor baru:
- Nama: Salma Prameswari
- Jabatan: Supervisor
- Foto: supervisor kak salma.png (di folder public/assets/foto div/)
- Path: `${import.meta.env.BASE_URL}assets/foto div/supervisor kak salma.png`

Sekarang ada 2 supervisors, jadikan 3. Layout: 3 cards horizontal, centered.

## TASK 5: Leaderboard Prestasi + Keaktifan di Dashboard CDA dan HEG
File: src/pages/aksara/CDADashboard.jsx, src/pages/aksara/HEGDashboard.jsx

### A) Leaderboard Prestasi (di CDA Dashboard)
Tambah section/tab baru "Leaderboard Prestasi" di CDA Dashboard.

Logic poin per status prestasi:
- Juara 1 = 100 poin
- Juara 2 = 85 poin
- Juara 3 = 70 poin
- Harapan 1 = 55 poin
- Harapan 2 = 40 poin
- Harapan 3 = 25 poin
- Honorable Mention = 15 poin

Cara hitung:
- Fetch semua prestasi: SELECT prestasi.*, users.name FROM prestasi LEFT JOIN users ON prestasi.user_id = users.id
- Atau fetch prestasi dulu, lalu fetch users terpisah
- Group by user_id, hitung total poin per user berdasarkan status
- Sort descending by total poin
- Tampilkan TOP 5 (atau lebih kalau mau)

Tampilan leaderboard:
- Heading: "Leaderboard Prestasi"
- Table/list dengan kolom: Rank (#), Nama, Total Poin
- Rank 1: highlight gold/amber accent
- Rank 2: silver/zinc accent  
- Rank 3: bronze/orange accent
- Rank 4-5: normal
- Style: bg-white rounded-xl border border-zinc-200 p-6
- Setiap row: flex, nama di kiri (font-bold), poin di kanan (font-black text-royal-600)

Filter berdasarkan cluster (gunakan clusterFilter yang sudah ada di CDA):
- Kalau filter "Semua": semua prestasi
- Kalau filter specific cluster: hanya prestasi dari cluster itu

### B) Leaderboard Keaktifan (di HEG Dashboard)
Tambah section/tab baru "Leaderboard Keaktifan" di HEG Dashboard.

Logic:
- Fetch: SELECT event_registrations.user_id, SUM(event_registrations.score) as total_score, users.name FROM event_registrations JOIN users ON event_registrations.user_id = users.id WHERE event_registrations.attended = true AND event_registrations.score > 0 GROUP BY event_registrations.user_id, users.name ORDER BY total_score DESC LIMIT 10
- Atau fetch semua event_registrations WHERE attended = true, lalu group di frontend

Tampilan sama persis seperti Leaderboard Prestasi tapi:
- Heading: "Leaderboard Keaktifan"
- Kolom: Rank, Nama, Total Skor
- Warna accent sama (gold/silver/bronze untuk top 3)

### C) Monthly Achievement Trends Chart (di CDA Dashboard)
Tambah chart line/area sederhana yang menunjukkan jumlah prestasi per bulan berdasarkan tanggal_prestasi (BUKAN created_at).

Logic:
- Fetch semua prestasi, group by MONTH(tanggal_prestasi)
- Kalau tanggal_prestasi null, fallback ke created_at
- Buat array 12 bulan terakhir, hitung jumlah prestasi per bulan

Tampilan:
- Buat dengan SVG sederhana (line chart) atau pakai bar chart horizontal
- JANGAN install library baru (recharts dll sudah ada, boleh pakai kalau sudah ter-install)
- Cek apakah recharts sudah ada di package.json. Kalau ada, pakai LineChart dari recharts
- Kalau tidak ada, buat SVG chart sederhana:
  - Container: bg-white rounded-xl border border-zinc-200 p-6
  - X-axis: bulan (Jan, Feb, Mar, ...)
  - Y-axis: jumlah prestasi
  - Line: stroke royal-500
  - Dots: fill royal-600

### D) Achievement Distribution (di CDA Dashboard)
Tampilkan distribusi prestasi per cabang sebagai horizontal bar chart (mirip yang sudah ada di home page statistik lomba, tapi versi lebih besar).

Logic:
- Fetch prestasi, group by cabang, count
- Sort descending

Tampilan:
- Horizontal bars dengan gradient warna royal
- Label cabang di kiri, count di kanan
- Max 10 cabang

### LAYOUT di CDA Dashboard:
Susun elemen baru ini di bawah tabs yang sudah ada, atau buat tab baru "Analytics":
1. Leaderboard Prestasi (kiri) | Distribution per Cabang (kanan) — 2 kolom
2. Monthly Trend Chart (full width di bawah)

### LAYOUT di HEG Dashboard:
Leaderboard Keaktifan tampilkan di tab "Skor Keaktifan" yang sudah ada, di bagian atas sebelum list event.

## RULES
- Import supabase: import { supabase } from "@/lib/supabase"
- Import auth: import { useAuth } from "@/context/AuthContext"
- Fetch data: useEffect dependency []
- Format tanggal: new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
- Style: Tailwind, rounded-xl, font-black heading, tanpa emoji
- JANGAN ubah yang sudah benar/berfungsi
- JANGAN ubah file: src/lib/supabase.js, src/context/AuthContext.jsx
- Cek apakah recharts ada di package.json sebelum import. Kalau tidak ada, pakai SVG manual atau install dulu: npm install recharts
- Test: npm run build HARUS sukses