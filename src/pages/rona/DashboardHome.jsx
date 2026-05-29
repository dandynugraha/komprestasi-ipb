import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Activity, Folder, Trophy, Calendar, Wallet, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import siteConfig from "@/config/site.config";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
};

const quickActions = [
  { icon: Award,    label: "Upload Prestasi", sub: "Foto & storytelling", path: "/dashboard/upload/prestasi", gradient: "from-amber-400 to-orange-500",   shadow: "rgba(251,146,60,0.35)"  },
  { icon: Activity, label: "Upload Kegiatan", sub: "Foto & storytelling", path: "/dashboard/upload/kegiatan", gradient: "from-emerald-500 to-emerald-600", shadow: "rgba(52,211,153,0.3)"   },
  { icon: Folder,   label: "Upload Project",  sub: "Foto & storytelling", path: "/dashboard/upload/project",  gradient: "from-blue-500 to-blue-600",       shadow: "rgba(59,130,246,0.3)"   },
  { icon: Trophy,   label: "My Lomba",        sub: "Tracking status",     path: "/dashboard/lomba",           gradient: "from-royal-500 to-royal-600",     shadow: "rgba(74,31,181,0.3)"    },
];

export default function DashboardHome() {
  const { profile } = useAuth();
  const firstName = profile?.name?.split(" ")[0] || "User";
  const clusterShort = siteConfig.clusterShort?.[profile?.cluster] || profile?.cluster || "";
  const roleRaw = (profile?.role || "").toLowerCase();
  const lokasiLabel = profile?.lokasi || "";

  return (
    <div className="p-5 sm:p-8">
      {/* Greeting card */}
      <motion.div
        className="relative overflow-hidden rounded-xl p-6 sm:p-8 mb-8 hero-gradient"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        {/* Lime blob */}
        <div className="absolute pointer-events-none" style={{
          top: "-50px", right: "-50px", width: "240px", height: "240px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(198,255,0,0.18) 0%, transparent 65%)",
        }} />
        {/* Decorative arcs — bottom right */}
        <div className="absolute bottom-0 right-0 pointer-events-none" style={{
          width: "120px", height: "120px", borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.06)",
          transform: "translate(40%, 40%)",
        }} />
        <div className="absolute bottom-0 right-0 pointer-events-none" style={{
          width: "72px", height: "72px", borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.09)",
          transform: "translate(35%, 35%)",
        }} />
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none" style={{
          background: "linear-gradient(90deg, transparent, rgba(198,255,0,0.35), transparent)",
        }} />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-white/40" />
            <span className="text-[11px] text-white/50 font-bold">
              {clusterShort}{clusterShort && lokasiLabel ? " · " : ""}{lokasiLabel}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Halo, {firstName}</h1>
          <p className="text-sm text-white/40 mt-1">Apa yang mau kamu kerjain hari ini?</p>
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        initial="hidden" animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      >
        {quickActions.map((a, i) => (
          <motion.div key={a.label} variants={fadeUp} custom={i}>
            <Link to={a.path} className="relative block bg-white rounded-xl border border-zinc-100 p-4 card-lift group overflow-hidden">
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
                background: "linear-gradient(135deg, transparent 50%, rgba(74,31,181,0.04) 100%)",
              }} />
              <div
                className={`relative w-10 h-10 rounded-lg bg-gradient-to-br ${a.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-all duration-200`}
                style={{ boxShadow: `0 6px 16px ${a.shadow}` }}
              >
                <a.icon size={18} className="text-white" />
              </div>
              <p className="relative text-xs font-bold text-zinc-900">{a.label}</p>
              <p className="relative text-[10px] text-zinc-400 mt-0.5">{a.sub}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Tracking lomba */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black text-zinc-900 flex items-center gap-2">
            <Trophy size={15} className="text-royal-500" /> Tracking lomba saya
          </h2>
          <Link to="/dashboard/lomba" className="text-[10px] text-royal-600 font-bold flex items-center gap-0.5">
            Lihat semua <ArrowRight size={11} />
          </Link>
        </div>
        <div className="relative bg-white rounded-xl border border-zinc-100 p-8 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: "radial-gradient(circle, #4A1FB5 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }} />
          <Trophy size={28} className="relative text-zinc-200 mx-auto mb-2" />
          <p className="relative text-xs text-zinc-400 font-medium">Belum ada lomba yang di-tracking</p>
          <Link to="/dashboard/lomba" className="relative inline-flex items-center gap-1 mt-3 text-[11px] font-bold text-royal-600 hover:underline">
            Tambah lomba pertama <ArrowRight size={11} />
          </Link>
        </div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-zinc-100 p-5">
          <h3 className="text-xs font-black text-zinc-900 flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center" style={{ boxShadow: "0 4px 10px rgba(59,130,246,0.3)" }}>
              <Calendar size={13} className="text-white" />
            </div>
            My Jadwal
          </h3>
          <div className="text-center py-6">
            <Calendar size={24} className="text-zinc-200 mx-auto mb-2" />
            <p className="text-[11px] text-zinc-400">Belum terhubung</p>
            <Link to="/dashboard/jadwal" className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-royal-600 hover:underline">
              Connect Google Calendar
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-100 p-5">
          <h3 className="text-xs font-black text-zinc-900 flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center" style={{ boxShadow: "0 4px 10px rgba(52,211,153,0.3)" }}>
              <Wallet size={13} className="text-white" />
            </div>
            My Pengeluaran
          </h3>
          <div className="text-center py-6">
            <Wallet size={24} className="text-zinc-200 mx-auto mb-2" />
            <p className="text-[11px] text-zinc-400">Belum ada pengeluaran</p>
            <Link to="/dashboard/pengeluaran" className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-royal-600 hover:underline">
              Catat pengeluaran pertama
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
