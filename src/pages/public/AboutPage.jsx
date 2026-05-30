import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, ChevronDown } from "lucide-react";

const PHOTO_BASE = `${import.meta.env.BASE_URL}assets/foto div/`;

function photoUrl(filename) {
  return PHOTO_BASE + filename.replace(/ /g, "%20");
}

function getInitials(name) {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function PersonPhoto({ name, photo, imgSize, fallbackBg = "bg-zinc-200", fallbackText = "text-zinc-500" }) {
  const [err, setErr] = useState(false);
  return (
    <div className={`${imgSize} rounded-full overflow-hidden border-4 border-white shadow-xl flex-shrink-0`}>
      {err ? (
        <div className={`w-full h-full ${fallbackBg} ${fallbackText} flex items-center justify-center font-black text-xl`}>
          {getInitials(name)}
        </div>
      ) : (
        <img src={photoUrl(photo)} alt={name} className="w-full h-full object-cover" onError={() => setErr(true)} />
      )}
    </div>
  );
}

function PersonCard({ name, role, photo, imgSize = "w-28 h-28", fallbackBg = "bg-zinc-200", fallbackText = "text-zinc-500", prominent = false }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 group transition-transform duration-200 hover:scale-105">
      <div className={prominent ? "drop-shadow-[0_0_20px_rgba(74,31,181,0.28)]" : ""}>
        <PersonPhoto name={name} photo={photo} imgSize={imgSize} fallbackBg={fallbackBg} fallbackText={fallbackText} />
      </div>
      <div>
        <p className={`font-black text-zinc-900 leading-tight ${prominent ? "text-base" : "text-sm"}`}>{name}</p>
        <p className="text-xs text-zinc-400 font-medium mt-0.5">{role}</p>
      </div>
    </div>
  );
}

function DivisionBanner({ heading, subheading, bannerClass }) {
  return (
    <div className={`${bannerClass} px-8 py-6`}>
      <h2 className="text-2xl font-black text-white">{heading}</h2>
      <p className="text-white/60 text-sm font-medium mt-1">{subheading}</p>
    </div>
  );
}

function ClusterCard({ title, count, members, headerGradient, badgeBg, badgeText }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden border border-zinc-100 shadow-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full ${headerGradient} px-6 py-5 flex items-center justify-between`}
      >
        <div className="flex items-center gap-3 flex-wrap text-left">
          <span className="text-base font-black text-white">{title}</span>
          <span className={`text-xs font-black px-2.5 py-1 rounded-full ${badgeBg} ${badgeText}`}>{count} anggota</span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="flex-shrink-0 ml-3">
          <ChevronDown className="text-white/70" size={20} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="bg-white p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {members.map((m) => (
                <div key={m} className="py-2 px-3 bg-zinc-50 rounded-lg text-sm text-zinc-600 text-center leading-tight">
                  {m}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Data ───────────────────────────────────────────────────────────────────

const misiList = [
  "Membangun ekosistem suportif bagi pengembangan prestasi akademik dan non-akademik;",
  "Menyediakan ruang pelatihan, mentoring, dan kolaborasi antar anggota dan Keluarga Mahasiswa 62;",
  "Mengapresiasi dan mengangkat cerita serta karya inspiratif dari anggota komunitas;",
  "Menguatkan karakter, semangat kolaborasi, dan kepemimpinan berintegritas;",
  "Meninggalkan dampak berkelanjutan sebagai warisan prestasi komunitas.",
];

const supervisors = [
  { name: "Restu Arie", role: "Supervisor", photo: "supervisor-mas ari.png" },
  { name: "Rafly Dwiki", role: "Supervisor", photo: "supervisor-mas api.png" },
];

const bph = [
  { name: "Brawijaya Mahdi Pratama", role: "Ketua", photo: "jay-ketua.png", prominent: true },
  { name: "Imanuel Kristian Sugiono", role: "Wakil Ketua", photo: "el-wakil.png" },
  { name: "Andien Aulia", role: "Sekretaris", photo: "andien-sekre.png" },
  { name: "Adela Anur Faindah", role: "Bendahara", photo: "adel-bendahara.png" },
];

const cda = {
  kadiv: { name: "Raffa Adzkia At-Tariq", role: "Kadiv CDA", photo: "raffa-staff cda.png" },
  staff: [
    { name: "Audia Maharani", role: "Staff CDA", photo: "audia-staff cda.png" },
    { name: "Humaira Radhwa", role: "Staff CDA", photo: "humai-staff cda.png" },
    { name: "Nurul Fathin Fawwazah", role: "Staff CDA", photo: "awa-staff cda.png" },
    { name: "Reisya Aprilian", role: "Staff CDA", photo: "reisya-staff cda.png" },
    { name: "Finastika Khoirunisa", role: "Staff CDA", photo: "finas-staff cda.png" },
  ],
};

const heg = {
  kadiv: { name: "Hasna Diva Salsabilla", role: "Kadiv HEG", photo: "hasna-kadiv heg.png" },
  staff: [
    { name: "Rafi Muhammad Nuuro Tamaam", role: "Staff HEG", photo: "rafi-staff heg.png" },
    { name: "Khornellio Eka Saputra", role: "Staff HEG", photo: "leo-staff heg.png" },
    { name: "Ajeng Khoerunisa", role: "Staff HEG", photo: "ajeng-staff heg.png" },
    { name: "Arsya Ahmad Rifaindika", role: "Staff HEG", photo: "arsya-staff heg.png" },
  ],
};

const mbd = {
  kadiv: { name: "Muhammad Dandy Nugraha", role: "Kadiv MBD", photo: "dandy-kadiv mbd.png" },
  staff: [
    { name: "Naila Nabila", role: "Staff MBD", photo: "nala-staff mbd.png" },
    { name: "Sarah Fahima Mumtaza", role: "Staff MBD", photo: "sarah-staff mbd.png" },
    { name: "Anisa Faradiba Maulidia", role: "Staff MBD", photo: "diba-staff mbd.png" },
    { name: "Umar Sadaad", role: "Staff MBD", photo: "sadad-staff mbd.png" },
  ],
};

const korvoks = {
  leaders: [
    { name: "Muhammad Fadhli Ramadhan", role: "Kadiv Korvoks", photo: "fadhli-kadiv korvoks.png" },
    { name: "Muhamad Fadhly Fathurrahman", role: "Wakil Korvoks", photo: "fathur-wakil korvoks.png" },
  ],
  staff: [
    { name: "Ahmad Abel Rabbani", role: "Staff Korvoks", photo: "abel-staff korvoks.png" },
    { name: "Rabiatul Adawiyah", role: "Staff Korvoks", photo: "rabia-staff korvoks.png" },
    { name: "Muhammad Ihsan Ali Fauzi", role: "Staff Korvoks", photo: "ihsan-staff korvoks.png" },
  ],
};

const ronaClusters = [
  {
    title: "Penulisan Ilmiah dan Olimpiade Sains",
    count: 45,
    headerGradient: "bg-gradient-to-r from-royal-600 to-royal-500",
    badgeBg: "bg-royal-50",
    badgeText: "text-royal-600",
    members: [
      "Ananda Syifa Azzahrah", "Cesya Adinda Putri", "Ekha Khoerunisa", "Nur Sa'diah",
      "Himeriko Awahita", "Jihandra Lecy Pramudya", "Meisya Salsa Zhafira", "Muhammad Alfa Ridho",
      "Nanda Putri Bachtiar", "Naswa Kartika Nurhasanah", "Ni Dea Yekti Utami", "Nicky Chandra Juniversaria",
      "Nur Fauzia Ramadhani", "Nur Halimah", "Putri Lira Savira Hilmansyah", "Ranthy Vitria Wijaksana",
      "Shabrina Nur Syafitri", "Muhammad Edo Aditya", "Junior Ariel", "Cepi Agustian",
      "Putri Nasyifah Aprillianty", "Nayla Azzahra", "Rahmi Fadhilah Ramadani", "Agni Meidinna",
      "Aisha Rachmania", "Cantika Ghaitsaa Putri Az Zahra", "Keyla Nusyifa Tazril", "Pratama Fahriel Sanjaya",
      "Ghina Nur Azizah", "Nayla Shafira", "Amalia Habibatul Hasan", "Nisrina Nailis Solahia",
      "Hilya Muhammad", "Julayka Nurul Annisa", "Kristian Aga Yudustira Laru", "Mariam Evita Anggun",
      "Muhammad Fakhriy Annas", "Nurwahyu Burlian Dana", "Olivia Dwi Zadri", "Shofa Nurchotima",
      "Siti Anisa Rahman", "Siti Luthfiyah", "Muhammad Baqir", "Oktaviani Eka Putri",
      "Xaviera Lupita Neema",
    ],
  },
  {
    title: "Bisnis dan Analisis Strategi",
    count: 25,
    headerGradient: "bg-gradient-to-r from-amber-500 to-amber-400",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    members: [
      "Ervina Tri Hendrawati", "Muhammad Ibadurrahman", "Muhammad Ihsan Athallah Shidiq",
      "Nazara Zafira Yunus", "Sipa Rahayu", "Faris Yakhzaan Jamaludin", "Ilham Holik",
      "Najwa Azzahra", "Najmah Mahmudah Kahhar", "Muhammad Arkana Habibilah", "Azzahro Nur Salsabila",
      "Muhammad Arsyal Fauzan", "Sekar Dewi Palupi", "Yusuf Ahsan Faris", "Belfa Fahrefi",
      "Firyal Naura Rafanda", "Hani Azalia Khairunnisa", "Muhammad Rafi Alfariza",
      "Namira Nurfayza Winanda", "Naura Ansya Liady Surya", "Selvi Ferawati",
      "Ni Wayan Puty Diva Sattvika", "Hilda Melani", "Fadhilah Nur Wahyuni", "Salsa Putri Azzahra",
    ],
  },
  {
    title: "Desain dan Visual Kreatif",
    count: 10,
    headerGradient: "bg-gradient-to-r from-blue-500 to-blue-400",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    members: [
      "Fatima Tuzahro", "Natasya Irvani Khoerunnisa", "Citra Putri Marlin",
      "Luthfiyah Mahfuzhah", "Hanisa Ramania", "Purnasri", "Elfarash Pradhikta Artha Damara",
      "Hanin Shafiyyurrahman", "Siti Nurmalasari", "Desta Restiani Anwar",
    ],
  },
];

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div>
      {/* ── Header ── */}
      <div className="hero-gradient wave-bottom relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />
        <div className="absolute pointer-events-none" style={{
          top: "-80px", right: "-80px", width: "380px", height: "380px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(198,255,0,0.18) 0%, transparent 65%)",
        }} />
        <div className="absolute pointer-events-none" style={{
          bottom: "-60px", left: "-60px", width: "260px", height: "260px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(123,77,255,0.22) 0%, transparent 65%)",
        }} />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: "#C6FF00" }}>
              Komprestasi IPB
            </span>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/15 shadow-xl shadow-black/10 flex-shrink-0">
                <Info size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white tracking-tight">About Us</h1>
                <p className="text-xs text-white/40 font-medium mt-1">Tentang Komprestasi IPB</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 -mt-4 relative z-10 pb-20 space-y-10">

        {/* ── Section 2: Visi & Misi ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="rounded-xl overflow-hidden border border-royal-100 shadow-sm"
          style={{ background: "linear-gradient(135deg, #F0EBFF 0%, #ffffff 60%)" }}
        >
          <div className="grid md:grid-cols-2 gap-0">
            {/* Visi */}
            <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-royal-100">
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.18em] text-royal-400 mb-3">Visi</span>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 leading-snug">
                Menjadi komunitas{" "}
                <span className="text-gradient">penggerak prestasi</span>{" "}
                mahasiswa tahun pertama IPB yang{" "}
                <span className="text-gradient">progresif, kolaboratif, dan berdampak</span>{" "}
                dalam mencetak generasi mahasiswa tahun pertama IPB{" "}
                <span className="text-gradient">inspiratif dan berdaya saing.</span>
              </h2>
            </div>
            {/* Misi */}
            <div className="p-8 md:p-10">
              <span className="inline-block text-[10px] font-black uppercase tracking-[0.18em] text-royal-400 mb-5">Misi</span>
              <ol className="space-y-4">
                {misiList.map((m, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="text-2xl font-black text-royal-500 leading-none flex-shrink-0 select-none">{i + 1}</span>
                    <p className="text-sm text-zinc-600 leading-relaxed">{m}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </motion.div>

        {/* ── Section 3: Supervisors ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="bg-white rounded-xl border border-zinc-100 shadow-sm p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-zinc-900">Supervisors</h2>
            <p className="text-sm text-zinc-400 font-medium mt-1">Direktorat Pengembangan Reputasi dan Prestasi Mahasiswa</p>
          </div>
          <div className="flex flex-wrap justify-center gap-10">
            {supervisors.map((s) => (
              <PersonCard key={s.name} name={s.name} role={s.role} photo={s.photo} imgSize="w-28 h-28" />
            ))}
          </div>
        </motion.div>

        {/* ── Section 4: BPH ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="bg-white rounded-xl border border-zinc-100 shadow-sm p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-zinc-900">Badan Pengurus Harian</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
            {bph.map((b) => (
              <PersonCard
                key={b.name}
                name={b.name}
                role={b.role}
                photo={b.photo}
                imgSize={b.prominent ? "w-32 h-32" : "w-28 h-28"}
                prominent={b.prominent}
              />
            ))}
          </div>
        </motion.div>

        {/* ── Section 5: CDA ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="rounded-xl overflow-hidden border border-zinc-100 shadow-sm"
        >
          <DivisionBanner
            heading="CDA"
            subheading="Capacity Development & Achievement"
            bannerClass="bg-gradient-to-r from-royal-600 to-royal-500"
          />
          <div className="bg-white p-8 space-y-8">
            <div className="flex justify-center">
              <PersonCard
                name={cda.kadiv.name}
                role={cda.kadiv.role}
                photo={cda.kadiv.photo}
                imgSize="w-36 h-36"
                prominent
                fallbackBg="bg-royal-100"
                fallbackText="text-royal-600"
              />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-5 text-center">Tim Staff</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-items-center">
                {cda.staff.map((s) => (
                  <PersonCard key={s.name} name={s.name} role={s.role} photo={s.photo} imgSize="w-24 h-24" fallbackBg="bg-royal-100" fallbackText="text-royal-600" />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Section 6: HEG ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="rounded-xl overflow-hidden border border-zinc-100 shadow-sm"
        >
          <DivisionBanner
            heading="HEG"
            subheading="Human Empowerment & Growth"
            bannerClass="bg-gradient-to-r from-pink-500 to-rose-500"
          />
          <div className="bg-white p-8 space-y-8">
            <div className="flex justify-center">
              <PersonCard
                name={heg.kadiv.name}
                role={heg.kadiv.role}
                photo={heg.kadiv.photo}
                imgSize="w-36 h-36"
                prominent
                fallbackBg="bg-pink-100"
                fallbackText="text-pink-600"
              />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-5 text-center">Tim Staff</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center">
                {heg.staff.map((s) => (
                  <PersonCard key={s.name} name={s.name} role={s.role} photo={s.photo} imgSize="w-24 h-24" fallbackBg="bg-pink-100" fallbackText="text-pink-600" />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Section 7: MBD ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="rounded-xl overflow-hidden border border-zinc-100 shadow-sm"
        >
          <DivisionBanner
            heading="MBD"
            subheading="Media Branding & Documentation"
            bannerClass="bg-gradient-to-r from-violet-500 to-purple-500"
          />
          <div className="bg-white p-8 space-y-8">
            <div className="flex justify-center">
              <PersonCard
                name={mbd.kadiv.name}
                role={mbd.kadiv.role}
                photo={mbd.kadiv.photo}
                imgSize="w-36 h-36"
                prominent
                fallbackBg="bg-violet-100"
                fallbackText="text-violet-600"
              />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-5 text-center">Tim Staff</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center">
                {mbd.staff.map((s) => (
                  <PersonCard key={s.name} name={s.name} role={s.role} photo={s.photo} imgSize="w-24 h-24" fallbackBg="bg-violet-100" fallbackText="text-violet-600" />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Section 8: Korvoks ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="rounded-xl overflow-hidden border border-zinc-100 shadow-sm"
        >
          <DivisionBanner
            heading="KORVOKS"
            subheading="Koordinator Vokasi"
            bannerClass="bg-gradient-to-r from-teal-500 to-cyan-500"
          />
          <div className="bg-white p-8 space-y-8">
            {/* Leaders: Kadiv + Wakil */}
            <div className="flex flex-wrap justify-center gap-10">
              {korvoks.leaders.map((l) => (
                <PersonCard
                  key={l.name}
                  name={l.name}
                  role={l.role}
                  photo={l.photo}
                  imgSize="w-36 h-36"
                  prominent
                  fallbackBg="bg-teal-100"
                  fallbackText="text-teal-600"
                />
              ))}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-5 text-center">Tim Staff</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 justify-items-center">
                {korvoks.staff.map((s) => (
                  <PersonCard key={s.name} name={s.name} role={s.role} photo={s.photo} imgSize="w-24 h-24" fallbackBg="bg-teal-100" fallbackText="text-teal-600" />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Section 9: Anggota Rona ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-zinc-900">Anggota Rona</h2>
            <p className="text-sm text-zinc-400 font-medium mt-1">80 anggota aktif</p>
          </div>
          <div className="space-y-3">
            {ronaClusters.map((cluster) => (
              <ClusterCard key={cluster.title} {...cluster} />
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
