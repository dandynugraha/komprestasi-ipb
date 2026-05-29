import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, ArrowRight, Users, CalendarDays, Folder, Sparkles, Zap, BookOpen, BarChart3, PieChart } from "lucide-react";
import siteConfig from "@/config/site.config";
import { supabase } from "@/lib/supabase";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

function EmptyState({ icon: Icon, title, sub, color = "bg-royal-50", iconColor = "text-royal-300" }) {
  return (
    <div className="relative flex flex-col items-center justify-center py-16 px-6 bg-white rounded-xl border border-zinc-100 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: "radial-gradient(circle, #4A1FB5 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }} />
      <div className={`relative w-16 h-16 rounded-xl ${color} flex items-center justify-center mb-4 shadow-sm`}>
        <Icon size={26} className={iconColor} />
      </div>
      <p className="relative text-sm font-bold text-zinc-400">{title}</p>
      <p className="relative text-[11px] text-zinc-300 mt-1">{sub}</p>
    </div>
  );
}

/* Mini donut chart SVG */
function DonutChart({ percent = 0, label, sub1, sub2 }) {
  const r = 54, c = 2 * Math.PI * r;
  const filled = c * (percent / 100);
  return (
    <div className="flex items-center gap-5">
      <div className="relative w-28 h-28 flex-shrink-0">
        <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
          <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
          <circle cx="64" cy="64" r={r} fill="none" stroke="#C6FF00" strokeWidth="12"
            strokeDasharray={`${filled} ${c - filled}`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-white">{percent}%</span>
          <span className="text-[8px] text-white/30 font-bold">ikut lomba</span>
        </div>
      </div>
      <div className="space-y-1.5">
        <p className="text-[11px] text-white/50 font-bold">{label}</p>
        <p className="text-xs text-white/70">{sub1}</p>
        <p className="text-xs text-white/40">{sub2}</p>
      </div>
    </div>
  );
}

/* Mini bar chart */
function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-[10px] text-white/50 font-bold w-14 text-right flex-shrink-0">{d.label}</span>
          <div className="flex-1 h-5 bg-white/5 rounded overflow-hidden">
            <motion.div
              className="h-full rounded"
              style={{ background: d.color || "linear-gradient(90deg, #7B4DFF, #C6FF00)" }}
              initial={{ width: 0 }}
              animate={{ width: `${(d.value / max) * 100}%` }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
            />
          </div>
          <span className="text-[10px] text-white/60 font-black w-6">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [stats, setStats] = useState({
    totalUsers: 105,
    totalPrestasi: 0,
    totalEvents: 0,
    totalProjects: 0,
    lombaParticipants: 0,
    lombaTotal: 105,
    cabangData: [],
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const { count: userCount } = await supabase.from("users").select("*", { count: "exact", head: true });
        const { count: prestasiCount } = await supabase.from("prestasi").select("*", { count: "exact", head: true }).in("status", ["Juara 1", "Juara 2", "Juara 3"]);
        const { count: eventCount } = await supabase.from("events").select("*", { count: "exact", head: true });
        const { count: projectCount } = await supabase.from("projects").select("*", { count: "exact", head: true });
        const { data: lombaUsers } = await supabase.from("lomba").select("user_id");
        const uniqueParticipants = new Set((lombaUsers || []).map(l => l.user_id)).size;
        const { data: lombaAll } = await supabase.from("lomba").select("cabang");
        const cabangCount = {};
        (lombaAll || []).forEach(l => {
          const c = l.cabang || "Lainnya";
          cabangCount[c] = (cabangCount[c] || 0) + 1;
        });
        const cabangData = Object.entries(cabangCount)
          .map(([label, value]) => ({ label, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);
        const total = userCount || 105;
        setStats({
          totalUsers: total,
          totalPrestasi: prestasiCount || 0,
          totalEvents: eventCount || 0,
          totalProjects: projectCount || 0,
          lombaParticipants: uniqueParticipants,
          lombaTotal: total,
          cabangData,
        });
      } catch (err) {
        console.error("Stats fetch error:", err);
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="hero-gradient wave-bottom relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }} />
        <div className="absolute inset-0 opacity-[0.12]" style={{
          backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Kampus_IPB_Dramaga%2C_Bogor%2C_Jawa_Barat.jpg/1280px-Kampus_IPB_Dramaga%2C_Bogor%2C_Jawa_Barat.jpg')",
          backgroundSize: "cover", backgroundPosition: "center",
        }} />
        {/* Lime blob top-right */}
        <div className="absolute pointer-events-none" style={{
          top: "-80px", right: "-80px", width: "480px", height: "480px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(198,255,0,0.14) 0%, transparent 65%)",
        }} />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-28 sm:pt-32 sm:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* LEFT */}
            <div className="lg:col-span-7">
              <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                <motion.span variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white/90 text-xs font-bold border border-white/10">
                  <Sparkles size={13} /> IPB University
                </motion.span>

                <motion.h1 variants={fadeUp} custom={1} className="mt-5 text-4xl sm:text-[3.2rem] font-black text-white leading-[1.05] tracking-tight">
                  Komunitas <span className="text-gradient">Prestasi</span> IPB
                </motion.h1>

                <motion.p variants={fadeUp} custom={2} className="mt-4 text-sm text-white/45 leading-relaxed max-w-md">
                  {siteConfig.tagline}
                </motion.p>

                {/* Floating stat cards */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="mt-6 flex flex-wrap gap-3">
                  <motion.div
                    animate={{ y: [0, -7, 0] }}
                    transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
                    className="bg-white rounded-xl p-4 shadow-2xl flex items-center gap-3 min-w-[180px] ring-1 ring-zinc-100/50"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0" style={{ boxShadow: "0 6px 16px rgba(251,146,60,0.35)" }}>
                      <Users size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-zinc-900 leading-none">{stats.totalUsers}</p>
                      <p className="text-[10px] text-zinc-400 font-medium mt-0.5">Total anggota aktif</p>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -7, 0] }}
                    transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, delay: 1.4 }}
                    className="bg-royal-900/80 backdrop-blur rounded-xl p-4 shadow-2xl flex items-center gap-3 min-w-[160px] border border-white/10"
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#C6FF00", boxShadow: "0 6px 16px rgba(198,255,0,0.4)" }}>
                      <Trophy size={18} className="text-royal-900" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-white leading-none">3</p>
                      <p className="text-[10px] text-white/40 font-medium mt-0.5">Cluster prestasi</p>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -7, 0] }}
                    transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, delay: 2.7 }}
                    className="bg-white/10 backdrop-blur rounded-xl p-4 shadow-xl flex items-center gap-3 min-w-[160px] border border-white/15"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0" style={{ boxShadow: "0 6px 16px rgba(52,211,153,0.3)" }}>
                      <CalendarDays size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-white leading-none">&mdash;</p>
                      <p className="text-[10px] text-white/40 font-medium mt-0.5">Event bulan ini</p>
                    </div>
                  </motion.div>
                </motion.div>

                {/* CTA */}
                <motion.div variants={fadeUp} custom={4} className="mt-7 flex flex-wrap gap-3">
                  <Link to="/login" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-white text-royal-700 font-bold text-sm hover:bg-zinc-100 transition-all hover:-translate-y-0.5 shadow-xl shadow-black/10">
                    Masuk ke Dashboard <ArrowRight size={16} />
                  </Link>
                  <Link to="/lomba" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-white/10 text-white font-bold text-sm border border-white/15 hover:bg-white/20 transition-all hover:-translate-y-0.5">
                    Lihat Info Lomba
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* RIGHT — Statistik */}
            <motion.div
              className="hidden lg:block lg:col-span-5"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="bg-white/[0.07] backdrop-blur-sm rounded-xl border border-white/12 p-6 space-y-6 shadow-xl shadow-black/10">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 size={14} className="text-white/40" />
                  <h3 className="text-xs font-black text-white/60 uppercase tracking-wider">Statistik Lomba</h3>
                </div>
                <DonutChart
                  percent={stats.lombaTotal > 0 ? Math.round((stats.lombaParticipants / stats.lombaTotal) * 100) : 0}
                  label="Partisipasi lomba"
                  sub1={`${stats.lombaParticipants} sudah ikut lomba`}
                  sub2={`${stats.lombaTotal - stats.lombaParticipants} belum ikut`}
                />
                <div className="h-px bg-white/6" />
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <PieChart size={12} className="text-white/30" />
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Cabang lomba</span>
                  </div>
                  <BarChart data={
                    stats.cabangData.length > 0
                      ? stats.cabangData.map((d, i) => ({
                          ...d,
                          color: [
                            "linear-gradient(90deg, #7B4DFF, #9B7AFF)",
                            "linear-gradient(90deg, #6231D4, #7B4DFF)",
                            "linear-gradient(90deg, #4A1FB5, #6231D4)",
                            "linear-gradient(90deg, #371595, #4A1FB5)",
                            "linear-gradient(90deg, #2E1065, #371595)",
                          ][i] || "linear-gradient(90deg, #2E1065, #371595)",
                        }))
                      : [{ label: "Belum ada", value: 0, color: "linear-gradient(90deg, #7B4DFF, #9B7AFF)" }]
                  } />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 -mt-6 relative z-10 mb-20">
        <motion.div
          className="bg-white rounded-xl shadow-2xl border border-zinc-100 p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {[
            { icon: Users, value: String(stats.totalUsers), label: "Total anggota", color: "from-royal-500 to-royal-600" },
            { icon: Trophy, value: stats.totalPrestasi > 0 ? String(stats.totalPrestasi) : "—", label: "Prestasi", color: "from-amber-400 to-orange-500" },
            { icon: CalendarDays, value: stats.totalEvents > 0 ? String(stats.totalEvents) : "—", label: "Event", color: "from-emerald-500 to-emerald-600" },
            { icon: Folder, value: stats.totalProjects > 0 ? String(stats.totalProjects) : "—", label: "Project", color: "from-blue-500 to-blue-600" },
          ].map((s, i) => (
            <div key={i} className="text-center group cursor-default">
              <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-all duration-200`} style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}>
                <s.icon size={18} className="text-white" />
              </div>
              <p className="text-3xl font-black text-zinc-900 group-hover:text-royal-600 transition-colors duration-200">{s.value}</p>
              <p className="text-xs text-zinc-400 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 pb-24 space-y-24">
        {/* PRESTASI */}
        <section>
          <span className="text-xs font-black text-royal-500 uppercase tracking-widest">Showcase</span>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 mt-2">Prestasi Juara</h2>
          <p className="text-sm text-zinc-400 mt-2 max-w-lg">Pencapaian terbaik dari anggota Komprestasi IPB</p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <EmptyState icon={Trophy} title="Belum ada prestasi" sub="Prestasi juara akan muncul di sini" color="bg-amber-50" iconColor="text-amber-300" />
          </div>
        </section>

        {/* PROJECT */}
        <section>
          <span className="text-xs font-black text-blue-500 uppercase tracking-widest">Karya</span>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 mt-2">Project</h2>
          <p className="text-sm text-zinc-400 mt-2">Karya dan project dari anggota</p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <EmptyState icon={Folder} title="Belum ada project" sub="Project anggota akan muncul di sini" color="bg-blue-50" iconColor="text-blue-300" />
          </div>
        </section>

        {/* EVENT */}
        <section>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Kegiatan</span>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 mt-2">Event Mendatang</h2>
              <p className="text-sm text-zinc-400 mt-2">Event terbuka dari divisi CDA dan HEG</p>
            </div>
            <Link to="/event" className="text-xs text-royal-600 font-bold flex items-center gap-1 hover:underline">
              Lihat semua <ArrowRight size={12} />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <EmptyState icon={CalendarDays} title="Belum ada event" sub="Event mendatang akan muncul di sini" color="bg-emerald-50" iconColor="text-emerald-300" />
          </div>
        </section>

        {/* BOTTOM CTA */}
        <motion.section
          className="relative overflow-hidden rounded-xl p-10 sm:p-14"
          style={{ background: "linear-gradient(135deg, #0D0520 0%, #1A0A3E 50%, #2E1065 100%)" }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />
          {/* Accent bar top */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(198,255,0,0.5), transparent)" }} />
          {/* Lime blob */}
          <div className="absolute pointer-events-none" style={{
            top: "-60px", right: "-60px", width: "280px", height: "280px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(198,255,0,0.16) 0%, transparent 65%)",
          }} />

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8">
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border border-white/10" style={{ color: "#C6FF00", background: "rgba(198,255,0,0.08)" }}>
                <Zap size={12} /> Join now
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-4 leading-tight">
                Bergabung dengan <span className="text-gradient">Komprestasi IPB</span>
              </h2>
              <p className="text-sm text-white/35 mt-3 max-w-md">
                Akses info lomba, tracking prestasi, dan jaringan kolaborasi antar mahasiswa berprestasi.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/login" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-black text-sm text-royal-900 transition-all hover:-translate-y-0.5 glow-lime" style={{ background: "#C6FF00" }}>
                Masuk sekarang <ArrowRight size={16} />
              </Link>
              <Link to="/faq" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-white/5 text-white/60 font-bold text-sm border border-white/10 hover:bg-white/10 transition-all">
                <BookOpen size={14} /> Pelajari lebih lanjut
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
