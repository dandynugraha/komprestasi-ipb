/**
 * SEED SCRIPT — Import 105 users dari data Excel ke Supabase
 * 
 * Jalankan SEKALI setelah Supabase project & database siap:
 *   node scripts/seed-users.mjs
 * 
 * REQUIREMENTS:
 *   - Isi SUPABASE_URL dan SERVICE_ROLE_KEY di bawah
 *   - Service Role Key (bukan anon key!) — dari Settings > API > service_role
 *   - Pastikan tabel "users" sudah dibuat via SQL Editor
 * 
 * ⚠️ PENTING:
 *   - Aisha Rachmania punya email sama dengan Agni Meidinna
 *     → Sudah diganti ke placeholder, ganti ke email asli Aisha
 */

const SUPABASE_URL = "https://pgbuhqqrpqzydhsrxxbe.supabase.co";      // ← GANTI
const SERVICE_ROLE_KEY = "HAPUS_SETELAH_SEED";  // ← GANTI

const users = [
  // ── RONA — Bisnis dan Analisis Strategi (25) ──
  { name: "Ervina Tri Hendrawati", email: "ervinahendrwt@gmail.com", password: "RONA622501", role: "Rona", cluster: "Bisnis dan Analisis Strategi", lokasi: "Dramaga" },
  { name: "Muhammad Ibadurrahman", email: "mibad2005@gmail.com", password: "RONA622502", role: "Rona", cluster: "Bisnis dan Analisis Strategi", lokasi: "Dramaga" },
  { name: "Muhammad Ihsan Athallah Shidiq", email: "ihsan.athallah@apps.ipb.ac.id", password: "RONA622503", role: "Rona", cluster: "Bisnis dan Analisis Strategi", lokasi: "Dramaga" },
  { name: "Nazara Zafira Yunus", email: "nazara.zy.75@gmail.com", password: "RONA622504", role: "Rona", cluster: "Bisnis dan Analisis Strategi", lokasi: "Dramaga" },
  { name: "Sipa Rahayu", email: "siparahayu@apps.ipb.ac.id", password: "RONA622505", role: "Rona", cluster: "Bisnis dan Analisis Strategi", lokasi: "Dramaga" },
  { name: "Faris Yakhzaan Jamaludin", email: "farisyakhzaan@apps.ipb.ac.id", password: "RONA622506", role: "Rona", cluster: "Bisnis dan Analisis Strategi", lokasi: "Dramaga" },
  { name: "Ilham Holik", email: "ilhamkholik2408@gmail.com", password: "RONA622507", role: "Rona", cluster: "Bisnis dan Analisis Strategi", lokasi: "Dramaga" },
  { name: "Najwa Azzahra", email: "zhrnazwa69@gmail.com", password: "RONA622508", role: "Rona", cluster: "Bisnis dan Analisis Strategi", lokasi: "Dramaga" },
  { name: "Najmah Mahmudah Kahhar", email: "najmahkahhar@apps.ipb.ac.id", password: "RONA622509", role: "Rona", cluster: "Bisnis dan Analisis Strategi", lokasi: "Dramaga" },
  { name: "Muhammad Arkana Habibilah", email: "arkanahabibilah@apps.ipb.ac.id", password: "RONA622510", role: "Rona", cluster: "Bisnis dan Analisis Strategi", lokasi: "Dramaga" },
  { name: "Azzahro Nur Salsabila", email: "salsabilaazzahro@apps.ipb.ac.id", password: "RONA622511", role: "Rona", cluster: "Bisnis dan Analisis Strategi", lokasi: "Dramaga" },
  { name: "Muhammad Arsyal Fauzan", email: "arsyalfauzan@apps.ipb.ac.id", password: "RONA622512", role: "Rona", cluster: "Bisnis dan Analisis Strategi", lokasi: "Dramaga" },
  { name: "Sekar Dewi Palupi", email: "dewiplp12sekar@apps.ipb.ac.id", password: "RONA622513", role: "Rona", cluster: "Bisnis dan Analisis Strategi", lokasi: "Dramaga" },
  { name: "Yusuf Ahsan Faris", email: "yusuffaris0812@gmail.com", password: "RONA622514", role: "Rona", cluster: "Bisnis dan Analisis Strategi", lokasi: "Dramaga" },
  { name: "Belfa Fahrefi", email: "belfafahrefi@gmail.com", password: "RONA622515", role: "Rona", cluster: "Bisnis dan Analisis Strategi", lokasi: "Dramaga" },
  { name: "Firyal Naura Rafanda", email: "rafanda21aura@gmail.com", password: "RONA622516", role: "Rona", cluster: "Bisnis dan Analisis Strategi", lokasi: "Vokasi" },
  { name: "Hani Azalia Khairunnisa", email: "hanizlia384@gmail.com", password: "RONA622517", role: "Rona", cluster: "Bisnis dan Analisis Strategi", lokasi: "Vokasi" },
  { name: "Muhammad Rafi Alfariza", email: "rafiialfariza@apps.ipb.ac.id", password: "RONA622518", role: "Rona", cluster: "Bisnis dan Analisis Strategi", lokasi: "Dramaga" },
  { name: "Namira Nurfayza Winanda", email: "namiranurfayza@apps.ipb.ac.id", password: "RONA622519", role: "Rona", cluster: "Bisnis dan Analisis Strategi", lokasi: "Vokasi" },
  { name: "Naura Ansya Liady Surya", email: "nauraansya@gmail.com", password: "RONA622520", role: "Rona", cluster: "Bisnis dan Analisis Strategi", lokasi: "Vokasi" },
  { name: "Selvi Ferawati", email: "selviferawati@apps.ipb.ac.id", password: "RONA622521", role: "Rona", cluster: "Bisnis dan Analisis Strategi", lokasi: "Vokasi" },
  { name: "Ni Wayan Puty Diva Sattvika", email: "divasattvika@apps.ipb.ac.id", password: "RONA622522", role: "Rona", cluster: "Bisnis dan Analisis Strategi", lokasi: "Vokasi" },
  { name: "Hilda Melani", email: "hildamelani133@gmail.com", password: "RONA622523", role: "Rona", cluster: "Bisnis dan Analisis Strategi", lokasi: "Vokasi" },
  { name: "Fadhilah Nur Wahyuni", email: "fadhilahnwynur@apps.ipb.ac.id", password: "RONA622524", role: "Rona", cluster: "Bisnis dan Analisis Strategi", lokasi: "Vokasi" },
  { name: "Salsa Putri Azzahra", email: "saputazzahra@apps.ipb.ac.id", password: "RONA622525", role: "Rona", cluster: "Bisnis dan Analisis Strategi", lokasi: "Vokasi" },
  // ── RONA — Desain dan Visual Kreatif (10) ──
  { name: "Fatima Tuzahro", email: "fatimatuzahro22062006@gmail.com", password: "RONA622526", role: "Rona", cluster: "Desain dan Visual Kreatif", lokasi: "Dramaga" },
  { name: "Natasya Irvani Khoerunnisa", email: "natasya09irvani@apps.ipb.ac.id", password: "RONA622527", role: "Rona", cluster: "Desain dan Visual Kreatif", lokasi: "Dramaga" },
  { name: "Citra Putri Marlin", email: "putrimarlinc@gmail.com", password: "RONA622528", role: "Rona", cluster: "Desain dan Visual Kreatif", lokasi: "Dramaga" },
  { name: "Luthfiyah Mahfuzhah", email: "luthfiyahmahfuzhah@apps.ipb.ac.id", password: "RONA622529", role: "Rona", cluster: "Desain dan Visual Kreatif", lokasi: "Dramaga" },
  { name: "Hanisa Ramania", email: "hanisaramania@apps.ipb.ac.id", password: "RONA622530", role: "Rona", cluster: "Desain dan Visual Kreatif", lokasi: "Dramaga" },
  { name: "Purnasri", email: "prnaa.sriipurnasri@apps.ipb.ac.id", password: "RONA622531", role: "Rona", cluster: "Desain dan Visual Kreatif", lokasi: "Vokasi" },
  { name: "Elfarash Pradhikta Artha Damara", email: "elfarashpradhiktaa@gmail.com", password: "RONA622532", role: "Rona", cluster: "Desain dan Visual Kreatif", lokasi: "Vokasi" },
  { name: "Hanin Shafiyyurrahman", email: "2006hnhanin@apps.ipb.ac.id", password: "RONA622533", role: "Rona", cluster: "Desain dan Visual Kreatif", lokasi: "Vokasi" },
  { name: "Siti Nurmalasari", email: "sytheanurmalasari@apps.ipb.ac.id", password: "RONA622534", role: "Rona", cluster: "Desain dan Visual Kreatif", lokasi: "Vokasi" },
  { name: "Desta Restiani Anwar", email: "destarestiani11@gmail.com", password: "RONA622535", role: "Rona", cluster: "Desain dan Visual Kreatif", lokasi: "Vokasi" },
  // ── RONA — Penulisan Ilmiah dan Olimpiade Sains (45) ──
  { name: "Ananda Syifa Azzahrah", email: "syifaazzahrah@apps.ipb.ac.id", password: "RONA622536", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Cesya Adinda Putri", email: "shroud.ctseacesya@apps.ipb.ac.id", password: "RONA622537", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Ekha Khoerunisa", email: "Ekhanisa167@gmail.com", password: "RONA622538", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Nur Sa'diah", email: "nuursadiah@apps.ipb.ac.id", password: "RONA622539", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Himeriko Awahita", email: "hime.rikoo@gmail.com", password: "RONA622540", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Jihandra Lecy Pramudya", email: "jhndrlecy@apps.ipb.ac.id", password: "RONA622541", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Meisya Salsa Zhafira", email: "meisyasalsa@apps.ipb.ac.id", password: "RONA622542", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Muhammad Alfa Ridho", email: "alfharidho@apps.ipb.ac.id", password: "RONA622543", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Nanda Putri Bachtiar", email: "nandabachtiar62@gmail.com", password: "RONA622544", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Naswa Kartika Nurhasanah", email: "kartikanaswa@apps.ipb.ac.id", password: "RONA622545", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Ni Dea Yekti Utami", email: "iamdeyyekti@apps.ipb.ac.id", password: "RONA622546", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Nicky Chandra Juniversaria", email: "nckyfcrzy_ahmad@apps.ipb.ac.id", password: "RONA622547", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Nur Fauzia Ramadhani", email: "nurfauziaptn@gmail.com", password: "RONA622548", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Nur Halimah", email: "halimahnur3306@gmail.com", password: "RONA622549", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Putri Lira Savira Hilmansyah", email: "savirahilmansyah@gmail.com", password: "RONA622550", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Ranthy Vitria Wijaksana", email: "rvitriawijaksana@apps.ipb.ac.id", password: "RONA622551", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Shabrina Nur Syafitri", email: "shabrinanrsyafitri@apps.ipb.ac.id", password: "RONA622552", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Muhammad Edo Aditya", email: "medoaditya27@gmail.com", password: "RONA622553", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Junior Ariel", email: "juniorariel@apps.ipb.ac.id", password: "RONA622554", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Cepi Agustian", email: "cepiagustian@apps.ipb.ac.id", password: "RONA622555", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Putri Nasyifah Aprillianty", email: "nasyifahputri@apps.ipb.ac.id", password: "RONA622556", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Nayla Azzahra", email: "azzahranayla@apps.ipb.ac.id", password: "RONA622557", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Vokasi" },
  { name: "Rahmi Fadhilah Ramadani", email: "rf9471841@gmail.com", password: "RONA622558", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Vokasi" },
  { name: "Agni Meidinna", email: "meidinna766@gmail.com", password: "RONA622559", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Vokasi" },
  // ⚠️ Email Aisha sama dengan Agni — GANTI email di bawah ke email asli Aisha!
  { name: "Aisha Rachmania", email: "GANTI_EMAIL_AISHA@gmail.com", password: "RONA622560", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Vokasi" },
  { name: "Cantika Ghaitsaa Putri Az Zahra", email: "cantikaghaitsaa@apps.ipb.ac.id", password: "RONA622561", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Vokasi" },
  { name: "Keyla Nusyifa Tazril", email: "keyla.nsyfaaa@gmail.com", password: "RONA622562", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Vokasi" },
  { name: "Pratama Fahriel Sanjaya", email: "pratamasanjaya@apps.ipb.ac.id", password: "RONA622563", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Vokasi" },
  { name: "Ghina Nur Azizah", email: "ghinanurazizah@apps.ipb.ac.id", password: "RONA622564", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Vokasi" },
  { name: "Nayla Shafira", email: "naysfraa@gmail.com", password: "RONA622565", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Vokasi" },
  { name: "Amalia Habibatul Hasan", email: "amal14hasanah@gmail.com", password: "RONA622566", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Nisrina Nailis Solahia", email: "nailisnisrina@apps.ipb.ac.id", password: "RONA622567", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Hilya Muhammad", email: "hilihmuh@gmail.com", password: "RONA622568", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Julayka Nurul Annisa", email: "julaykanurul@apps.ipb.ac.id", password: "RONA622569", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Kristian Aga Yudustira Laru", email: "kristianaga0@gmail.com", password: "RONA622570", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Mariam Evita Anggun", email: "mariamevitaanggun@apps.ipb.ac.id", password: "RONA622571", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Muhammad Fakhriy Annas", email: "fakhriyannas@apps.ipb.ac.id", password: "RONA622572", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Nurwahyu Burlian Dana", email: "ipbburliandana@apps.ipb.ac.id", password: "RONA622573", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Olivia Dwi Zadri", email: "oliviadwizdr@gmail.com", password: "RONA622574", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Shofa Nurchotima", email: "shofanurchotima@apps.ipb.ac.id", password: "RONA622575", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Siti Anisa Rahman", email: "anisarahman@apps.ipb.ac.id", password: "RONA622576", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Siti Luthfiyah", email: "tekpangsiti@apps.ipb.ac.id", password: "RONA622577", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Muhammad Baqir", email: "muhammadbaqir@apps.ipb.ac.id", password: "RONA622578", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Oktaviani Eka Putri", email: "ekaputrii_oktaviani@apps.ipb.ac.id", password: "RONA622579", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Dramaga" },
  { name: "Xaviera Lupita Neema", email: "rara_18xaviera@apps.ipb.ac.id", password: "RONA622580", role: "Rona", cluster: "Penulisan Ilmiah dan Olimpiade Sains", lokasi: "Vokasi" },
  // ── AKSARA — CDA (6) ──
  { name: "Audia Maharani", email: "audiamaharani@apps.ipb.ac.id", password: "AKSARA6281", role: "cda (bisnis)", cluster: null, lokasi: "Dramaga" },
  { name: "Humaira Radhwa", email: "humaihumaira@apps.ipb.ac.id", password: "AKSARA6282", role: "cda (desain)", cluster: null, lokasi: "Dramaga" },
  { name: "Nurul Fathin Fawwazah", email: "nf21307nurul@apps.ipb.ac.id", password: "AKSARA6283", role: "cda (penulisan)", cluster: null, lokasi: "Dramaga" },
  { name: "Reisya Aprilian", email: "work1aprilian@apps.ipb.ac.id", password: "AKSARA6284", role: "cda (olimpiade)", cluster: null, lokasi: "Dramaga" },
  { name: "Finastika Khoirunisa", email: "khoirunisafinastika@apps.ipb.ac.id", password: "AKSARA6285", role: "cda", cluster: null, lokasi: "Dramaga" },
  { name: "Raffa Adzkia At-Tariq", email: "raffaadzkiaattariq@apps.ipb.ac.id", password: "AKSARA6286", role: "cda", cluster: null, lokasi: "Dramaga" },
  // ── AKSARA — MBD (5) ──
  { name: "Naila Nabila", email: "naila007nabila@apps.ipb.ac.id", password: "AKSARA6287", role: "mbd (ilustrator)", cluster: null, lokasi: "Dramaga" },
  { name: "Sarah Fahima Mumtaza", email: "sarahmumtaza@apps.ipb.ac.id", password: "AKSARA6288", role: "mbd (desain grafis)", cluster: null, lokasi: "Dramaga" },
  { name: "Anisa Faradiba Maulidia", email: "dipsiimaulidia@apps.ipb.ac.id", password: "AKSARA6289", role: "mbd (video editor)", cluster: null, lokasi: "Dramaga" },
  { name: "Umar Sadaad", email: "detectivesadaad@apps.ipb.ac.id", password: "AKSARA6290", role: "mbd (multimedia)", cluster: null, lokasi: "Dramaga" },
  { name: "Muhammad Dandy Nugraha", email: "dandy7251@gmail.com", password: "AKSARA6291", role: "mbd", cluster: null, lokasi: "Dramaga" },
  // ── AKSARA — HEG (5) ──
  { name: "Hasna Diva Salsabilla", email: "hasnasalsabilla@apps.ipb.ac.id", password: "AKSARA6292", role: "heg", cluster: null, lokasi: "Dramaga" },
  { name: "Rafi Muhammad Nuuro Tamaam", email: "rftamaam@apps.ipb.ac.id", password: "AKSARA6293", role: "heg", cluster: null, lokasi: "Dramaga" },
  { name: "Khornellio Eka Saputra", email: "khornellioekasaputra@apps.ipb.ac.id", password: "AKSARA6294", role: "heg", cluster: null, lokasi: "Dramaga" },
  { name: "Ajeng Khoerunisa", email: "ajengkhrsn621ajeng@apps.ipb.ac.id", password: "AKSARA6295", role: "heg", cluster: null, lokasi: "Dramaga" },
  { name: "Arsya Ahmad Rifaindika", email: "arsyarifaindika@apps.ipb.ac.id", password: "AKSARA6296", role: "heg", cluster: null, lokasi: "Dramaga" },
  // ── AKSARA — Korvoks (5) ──
  { name: "Muhammad Fadhli Ramadhan", email: "muhammadfadhli@apps.ipb.ac.id", password: "AKSARA6297", role: "korvoks", cluster: null, lokasi: "Vokasi" },
  { name: "Muhamad Fadhly Fathurrahman", email: "fadhlyy_fathurrahman@apps.ipb.ac.id", password: "AKSARA6298", role: "korvoks", cluster: null, lokasi: "Vokasi" },
  { name: "Ahmad Abel Rabbani", email: "ahmadrabbani@apps.ipb.ac.id", password: "AKSARA6299", role: "korvoks", cluster: null, lokasi: "Vokasi" },
  { name: "Rabiatul Adawiyah", email: "rabiaaadawiyah@apps.ipb.ac.id", password: "AKSARA62100", role: "korvoks", cluster: null, lokasi: "Vokasi" },
  { name: "Muhammad Ihsan Ali Fauzi", email: "ihsanalifauzi@apps.ipb.ac.id", password: "AKSARA62101", role: "korvoks", cluster: null, lokasi: "Vokasi" },
  // ── AKSARA — BPH (4) ──
  { name: "Brawijaya Mahdi Pratama", email: "brawijayapratama@apps.ipb.ac.id", password: "AKSARA62102", role: "bph", cluster: null, lokasi: "Dramaga" },
  { name: "Imanuel Kristian Sugiono", email: "imanuelkskristian@apps.ipb.ac.id", password: "AKSARA62103", role: "bph", cluster: null, lokasi: "Dramaga" },
  { name: "Andien Aulia", email: "andienaulia@apps.ipb.ac.id", password: "AKSARA62104", role: "bph", cluster: null, lokasi: "Dramaga" },
  { name: "Adela Anur Faindah", email: "faindahadela@apps.ipb.ac.id", password: "AKSARA62105", role: "bph", cluster: null, lokasi: "Dramaga" },
];

async function createUser(u) {
  const authRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { name: u.name },
    }),
  });
  if (!authRes.ok) {
    const err = await authRes.json();
    throw new Error(`Auth: ${err.msg || err.message || JSON.stringify(err)}`);
  }
  const authUser = await authRes.json();

  const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      id: authUser.id,
      name: u.name,
      email: u.email,
      role: u.role,
      cluster: u.cluster,
      lokasi: u.lokasi,
    }),
  });
  if (!profileRes.ok) throw new Error(`Profile: ${await profileRes.text()}`);
  return authUser.id;
}

async function main() {
  console.log(`\n🚀 Seeding ${users.length} users...\n`);
  if (SUPABASE_URL.includes("YOUR_PROJECT")) {
    console.error("❌ Isi SUPABASE_URL dan SERVICE_ROLE_KEY dulu!");
    process.exit(1);
  }
  let ok = 0, fail = 0;
  const errs = [];
  for (const u of users) {
    try {
      await createUser(u);
      ok++;
      process.stdout.write(`\r  ✅ ${ok}/${users.length} — ${u.name.padEnd(35)}`);
    } catch (e) {
      fail++;
      errs.push({ name: u.name, email: u.email, err: e.message });
    }
    await new Promise(r => setTimeout(r, 100));
  }
  console.log(`\n\n✅ Berhasil: ${ok}  ❌ Gagal: ${fail}`);
  if (errs.length) {
    console.log("\nErrors:");
    errs.forEach(e => console.log(`  ${e.name} (${e.email}): ${e.err}`));
  }
}
main();
