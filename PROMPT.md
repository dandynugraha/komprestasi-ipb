Project React+Vite web organisasi "Komprestasi IPB". Fokus: halaman About Us.

JANGAN ubah yang sudah berfungsi benar. HANYA ubah file src/pages/public/AboutPage.jsx.

## Buat halaman About Us lengkap
File: src/pages/public/AboutPage.jsx

Ganti seluruh isi halaman (sekarang cuma "Coming soon") dengan halaman About Us yang LENGKAP dan MENARIK.

Foto-foto pengurus ada di: public/assets/foto div/
Gunakan path: `${import.meta.env.BASE_URL}assets/foto div/NAMAFILE.png`

### LAYOUT HALAMAN (urutan dari atas ke bawah):

#### SECTION 1: Header (tetap pakai hero-gradient purple yang sudah ada di halaman lain)
- Icon Info + "About Us" + "Tentang Komprestasi IPB"

#### SECTION 2: Visi & Misi
Background: bg-white rounded-xl border border-zinc-200 p-8

VISI:
"Menjadi komunitas penggerak prestasi mahasiswa tahun pertama IPB yang progresif, kolaboratif, dan berdampak dalam mencetak generasi mahasiswa tahun pertama IPB inspiratif dan berdaya saing."

MISI (numbered list):
1. Membangun ekosistem suportif bagi pengembangan prestasi akademik dan non-akademik;
2. Menyediakan ruang pelatihan, mentoring, dan kolaborasi antar anggota dan Keluarga Mahasiswa 62;
3. Mengapresiasi dan mengangkat cerita serta karya inspiratif dari anggota komunitas;
4. Menguatkan karakter, semangat kolaborasi, dan kepemimpinan berintegritas;
5. Meninggalkan dampak berkelanjutan sebagai warisan prestasi komunitas.

Design: Visi di kiri dengan heading besar, Misi di kanan sebagai numbered list. Atau stack di mobile.

#### SECTION 3: Struktur Organisasi — SUPERVISORS
Heading: "Supervisors"
Subheading: "Direktorat Pengembangan Reputasi dan Prestasi Mahasiswa"

2 cards horizontal, centered:
1. Restu Arie — Supervisor — foto: supervisor-mas ari.png
2. Rafly Dwiki — Supervisor — foto: supervisor-mas api.png

Card design: foto bulat (w-28 h-28 rounded-full object-cover), nama font-black, jabatan text-zinc-400

#### SECTION 4: Struktur Organisasi — BPH (Badan Pengurus Harian)
Heading: "Badan Pengurus Harian"

4 cards horizontal, centered:
1. Brawijaya Mahdi Pratama — Ketua — foto: jay-ketua.png
2. Imanuel Kristian Sugiono — Wakil Ketua — foto: el-wakil.png
3. Andien Aulia — Sekretaris — foto: andien-Sekre.png
4. Adela Anur Faindah — Bendahara — foto: adel-bendahara.png

Ketua card sedikit lebih besar atau prominent (highlight). Layout: 4 kolom di desktop, 2 kolom di mobile.

#### SECTION 5: Divisi CDA (Capacity Development & Achievement)
Heading: "CDA"
Subheading: "Capacity Development & Achievement"
Accent color: bg-royal-50 border-royal-200

Kadiv di atas (card besar):
- Raffa Adzkia At-Tariq — Kadiv CDA — foto: raffa-staff cda.png

Staff di bawah (cards kecil, grid 5 kolom):
- Audia Maharani — Staff CDA — foto: audia-staff cda.png
- Humaira Radhwa — Staff CDA — foto: humai-staff cda.png
- Nurul Fathin Fawwazah — Staff CDA — foto: awa-staff cda.png
- Reisya Aprilian — Staff CDA — foto: reisya-staff cda.png
- Finastika Khoirunisa — Staff CDA — foto: finas-staff cda.png

#### SECTION 6: Divisi HEG (Human Empowerment & Growth)
Heading: "HEG"
Subheading: "Human Empowerment & Growth"
Accent color: bg-pink-50 border-pink-200

Kadiv di atas:
- Hasna Diva Salsabilla — Kadiv HEG — foto: hasna-kadiv heg.png

Staff di bawah (grid 4 kolom):
- Rafi Muhammad Nuuro Tamaam — Staff HEG — foto: rafi-staff heg.png
- Khornellio Eka Saputra — Staff HEG — foto: leo-staff heg.png
- Ajeng Khoerunisa — Staff HEG — foto: ajeng-staff heg.png
- Arsya Ahmad Rifaindika — Staff HEG — foto: arsya-staff heg.png

#### SECTION 7: Divisi MBD (Media Branding & Documentation)
Heading: "MBD"
Subheading: "Media Branding & Documentation"
Accent color: bg-violet-50 border-violet-200

Kadiv di atas:
- Muhammad Dandy Nugraha — Kadiv MBD — foto: dandy-kadiv mbd.png

Staff di bawah (grid 4 kolom):
- Naila Nabila — Staff MBD — foto: nala-staff mbd.png
- Sarah Fahima Mumtaza — Staff MBD — foto: sarah-staff mbd.png
- Anisa Faradiba Maulidia — Staff MBD — foto: diba-staff mbd.png
- Umar Sadaad — Staff MBD — foto: sadad-staff mbd.png

#### SECTION 8: Divisi Korvoks (Koordinator Vokasi)
Heading: "KORVOKS"
Subheading: "Koordinator Vokasi"
Accent color: bg-teal-50 border-teal-200

Kadiv + Wakil di atas (2 cards):
- Muhammad Fadhli Ramadhan — Kadiv Korvoks — foto: fadhli-kadiv korvoks.png
- Muhamad Fadhly Fathurrahman — Wakil Korvoks — foto: fathur-wakil korvoks.png

Staff di bawah (grid 3 kolom):
- Ahmad Abel Rabbani — Staff Korvoks — foto: abel-staff korvoks.png
- Rabiatul Adawiyah — Staff Korvoks — foto: rabia-staff korvoks.png
- Muhammad Ihsan Ali Fauzi — Staff Korvoks — foto: ihsan-staff korvoks.png

#### SECTION 9: Anggota Rona (TANPA foto, hanya nama)
Heading: "Anggota Rona"
Subheading: "80 anggota aktif"

3 sub-sections berdasarkan cluster, masing-masing collapsible/expandable:

A) "Penulisan Ilmiah dan Olimpiade Sains" — 45 anggota
Badge: bg-royal-50 text-royal-600
Nama-nama (tampilkan sebagai grid 3-4 kolom teks, tanpa foto):
Ananda Syifa Azzahrah, Cesya Adinda Putri, Ekha Khoerunisa, Nur Sa'diah, Himeriko Awahita, Jihandra Lecy Pramudya, Meisya Salsa Zhafira, Muhammad Alfa Ridho, Nanda Putri Bachtiar, Naswa Kartika Nurhasanah, Ni Dea Yekti Utami, Nicky Chandra Juniversaria, Nur Fauzia Ramadhani, Nur Halimah, Putri Lira Savira Hilmansyah, Ranthy Vitria Wijaksana, Shabrina Nur Syafitri, Muhammad Edo Aditya, Junior Ariel, Cepi Agustian, Putri Nasyifah Aprillianty, Nayla Azzahra, Rahmi Fadhilah Ramadani, Agni Meidinna, Aisha Rachmania, Cantika Ghaitsaa Putri Az Zahra, Keyla Nusyifa Tazril, Pratama Fahriel Sanjaya, Ghina Nur Azizah, Nayla Shafira, Amalia Habibatul Hasan, Nisrina Nailis Solahia, Hilya Muhammad, Julayka Nurul Annisa, Kristian Aga Yudustira Laru, Mariam Evita Anggun, Muhammad Fakhriy Annas, Nurwahyu Burlian Dana, Olivia Dwi Zadri, Shofa Nurchotima, Siti Anisa Rahman, Siti Luthfiyah, Muhammad Baqir, Oktaviani Eka Putri, Xaviera Lupita Neema

B) "Bisnis dan Analisis Strategi" — 25 anggota
Badge: bg-amber-50 text-amber-600
Nama-nama:
Ervina Tri Hendrawati, Muhammad Ibadurrahman, Muhammad Ihsan Athallah Shidiq, Nazara Zafira Yunus, Sipa Rahayu, Faris Yakhzaan Jamaludin, Ilham Holik, Najwa Azzahra, Najmah Mahmudah Kahhar, Muhammad Arkana Habibilah, Azzahro Nur Salsabila, Muhammad Arsyal Fauzan, Sekar Dewi Palupi, Yusuf Ahsan Faris, Belfa Fahrefi, Firyal Naura Rafanda, Hani Azalia Khairunnisa, Muhammad Rafi Alfariza, Namira Nurfayza Winanda, Naura Ansya Liady Surya, Selvi Ferawati, Ni Wayan Puty Diva Sattvika, Hilda Melani, Fadhilah Nur Wahyuni, Salsa Putri Azzahra

C) "Desain dan Visual Kreatif" — 10 anggota
Badge: bg-blue-50 text-blue-600
Nama-nama:
Fatima Tuzahro, Natasya Irvani Khoerunnisa, Citra Putri Marlin, Luthfiyah Mahfuzhah, Hanisa Ramania, Purnasri, Elfarash Pradhikta Artha Damara, Hanin Shafiyyurrahman, Siti Nurmalasari, Desta Restiani Anwar

### DESIGN GUIDELINES
- Header: hero-gradient wave-bottom (sama seperti halaman Lomba, Event, dll)
- Setiap section divisi: bg-white rounded-xl border p-6-8, dengan accent color berbeda per divisi
- Foto: rounded-full object-cover, border-2 border-white shadow-lg
- Kadiv foto lebih besar (w-32 h-32), staff foto lebih kecil (w-24 h-24)
- Nama: font-black text-zinc-900
- Jabatan: text-xs text-zinc-400 font-medium
- Anggota Rona: collapsible per cluster, klik untuk expand. Default collapsed. Pakai state dan AnimatePresence dari framer-motion atau simple toggle.
- Rona nama: text-sm text-zinc-600, grid layout tanpa foto
- Section spacing: space-y-12 atau space-y-16
- Mobile responsive: grid cols reduce, foto resize
- Tanpa emoji
- Style consistent dengan halaman lain di project

### DESIGN GUIDELINES PLUS

OVERALL: Halaman ini harus terasa PREMIUM dan BOLD, bukan template biasa.

- Header: hero-gradient wave-bottom (sama seperti halaman lain)

- Section Visi Misi: 
  Background: gradient subtle dari royal-50 ke white
  Visi: text-2xl font-black, highlight keyword dengan text-gradient (lime green)
  Misi: numbered dengan angka besar berwarna royal-500 di kiri, teks di kanan
  Layout: 2 kolom di desktop (visi kiri, misi kanan), stack di mobile

- Supervisors & BPH:
  Background: bg-white
  Card style: text-center, foto di atas, nama + jabatan di bawah
  Foto: rounded-full object-cover border-4 border-white shadow-xl
  BPH Ketua: card lebih besar, ada subtle glow shadow-royal-200
  Hover effect: scale-105 transition

- Divisi sections:
  Setiap divisi punya FULL-WIDTH colored banner di atas:
  CDA: bg-gradient-to-r from-royal-500 to-royal-600 (purple)
  HEG: bg-gradient-to-r from-pink-500 to-rose-500
  MBD: bg-gradient-to-r from-violet-500 to-purple-500
  Korvoks: bg-gradient-to-r from-teal-500 to-cyan-500
  Banner berisi: nama divisi (text-2xl font-black text-white) + kepanjangan (text-white/60)
  Di bawah banner: cards pengurus dengan bg-white

- Kadiv card: w-36 h-36 foto, prominent, center, nama besar
- Staff cards: w-24 h-24 foto, grid layout, nama lebih kecil
- Semua foto punya onError fallback: div rounded-full dengan inisial 2 huruf, bg-gradient sesuai warna divisi

- Rona section:
  3 cluster sebagai accordion/collapsible cards
  Header card: gradient sesuai cluster (royal untuk Penulisan, amber untuk Bisnis, blue untuk Desain)
  Klik header → expand menampilkan grid nama-nama (3 kolom desktop, 2 mobile)
  Setiap nama: py-2 px-3 bg-zinc-50 rounded-lg text-sm
  Count badge di header: "45 anggota" dll

- Mobile: semua grid reduce, foto resize smaller
- Tanpa emoji, font-black headings, rounded-xl (bukan rounded-3xl)
- Smooth scroll between sections

### CATATAN FILE FOTO
Semua foto ada di public/assets/foto div/ dengan extension .png
Spasi di nama folder "foto div" HARUS dipertahankan di path.
Beberapa file mungkin punya nama yang sedikit berbeda — gunakan PERSIS nama yang aku tulis di atas.
Kalau foto gagal load, tampilkan fallback: div dengan inisial nama (2 huruf pertama), bg-zinc-200 text-zinc-500.

Test: npm run build HARUS sukses.