import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Award, Activity, Folder, Trophy, Calendar, Wallet,
  ArrowRight, Sparkles, Upload, Clock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import siteConfig from "@/config/site.config";

const fmt = (n) => new Intl.NumberFormat("id-ID").format(n || 0);

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function lombaBadge(status) {
  const s = (status || "").toLowerCase();
  if (s === "peserta") return "bg-zinc-100 text-zinc-600";
  if (s === "finalis") return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

const uploadTypeConfig = {
  prestasi: { label: "Prestasi", color: "bg-amber-100 text-amber-700" },
  kegiatan: { label: "Kegiatan", color: "bg-emerald-100 text-emerald-700" },
  project:  { label: "Project",  color: "bg-blue-100 text-blue-700"    },
};

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
  const { user, profile } = useAuth();
  const firstName = profile?.name?.split(" ")[0] || "User";
  const clusterShort = siteConfig.clusterShort?.[profile?.cluster] || profile?.cluster || "";
  const lokasiLabel = profile?.lokasi || "";

  const [lomba, setLomba] = useState([]);
  const [pengeluaran, setPengeluaran] = useState([]);
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    if (user) fetchAll();
  }, [user?.id]);

  async function fetchAll() {
    try {
      const [
        { data: lombaData },
        { data: pengeluaranData },
        { data: prestasiData },
        { data: kegiatanData },
        { data: projectData },
      ] = await Promise.all([
        supabase.from("lomba").select("id, title, cabang, status, deadline").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3),
        supabase.from("pengeluaran").select("id, name, amount, date, category").eq("user_id", user.id).order("date", { ascending: false }).limit(3),
        supabase.from("prestasi").select("id, title, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("kegiatan").select("id, title, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("projects").select("id, title, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
      ]);

      setLomba(lombaData || []);
      setPengeluaran(pengeluaranData || []);

      const merged = [
        ...(prestasiData || []).map(i => ({ ...i, _type: "prestasi" })),
        ...(kegiatanData || []).map(i => ({ ...i, _type: "kegiatan" })),
        ...(projectData || []).map(i => ({ ...i, _type: "project"  })),
      ]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      setUploads(merged);
    } catch (err) {
      console.error("DashboardHome fetch error:", err);
    }
  }

  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const totalMonth = pengeluaran
    .filter(i => new Date(i.date) >= firstOfMonth)
    .reduce((sum, i) => sum + (i.amount || 0), 0);

  return (
    <div className="p-5 sm:p-8">
      {/* Greeting card */}
      <motion.div
        className="relative overflow-hidden rounded-xl p-6 sm:p-8 mb-8 hero-gradient"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div className="absolute pointer-events-none" style={{
          top: "-50px", right: "-50px", width: "240px", height: "240px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(198,255,0,0.18) 0%, transparent 65%)",
        }} />
        <div className="absolute bottom-0 right-0 pointer-events-none" style={{ width: "120px", height: "120px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)", transform: "translate(40%, 40%)" }} />
        <div className="absolute bottom-0 right-0 pointer-events-none" style={{ width: "72px", height: "72px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.09)", transform: "translate(35%, 35%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(198,255,0,0.35), transparent)" }} />

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
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: "linear-gradient(135deg, transparent 50%, rgba(74,31,181,0.04) 100%)" }} />
              <div className={`relative w-10 h-10 rounded-lg bg-gradient-to-br ${a.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-all duration-200`} style={{ boxShadow: `0 6px 16px ${a.shadow}` }}>
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
        {lomba.length === 0 ? (
          <div className="relative bg-white rounded-xl border border-zinc-100 p-8 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, #4A1FB5 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            <Trophy size={28} className="relative text-zinc-200 mx-auto mb-2" />
            <p className="relative text-xs text-zinc-400 font-medium">Belum ada lomba yang di-tracking</p>
            <Link to="/dashboard/lomba" className="relative inline-flex items-center gap-1 mt-3 text-[11px] font-bold text-royal-600 hover:underline">
              Tambah lomba pertama <ArrowRight size={11} />
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {lomba.map(item => (
              <div key={item.id} className="bg-white rounded-xl border border-zinc-100 px-4 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-zinc-900 truncate">{item.title}</p>
                  {item.cabang && <p className="text-[10px] text-zinc-400 mt-0.5">{item.cabang}</p>}
                  {item.deadline && (
                    <p className="text-[10px] text-zinc-300 mt-0.5 flex items-center gap-1">
                      <Clock size={9} /> {formatDate(item.deadline)}
                    </p>
                  )}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${lombaBadge(item.status)}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload terbaru saya */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black text-zinc-900 flex items-center gap-2">
            <Upload size={15} className="text-blue-500" /> Upload terbaru saya
          </h2>
          <Link to="/dashboard/my-uploads" className="text-[10px] text-royal-600 font-bold flex items-center gap-0.5">
            Lihat semua <ArrowRight size={11} />
          </Link>
        </div>
        {uploads.length === 0 ? (
          <div className="relative bg-white rounded-xl border border-zinc-100 p-8 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, #4A1FB5 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            <Upload size={28} className="relative text-zinc-200 mx-auto mb-2" />
            <p className="relative text-xs text-zinc-400 font-medium">Belum ada upload</p>
            <Link to="/dashboard/upload/prestasi" className="relative inline-flex items-center gap-1 mt-3 text-[11px] font-bold text-royal-600 hover:underline">
              Upload pertama <ArrowRight size={11} />
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {uploads.map(item => {
              const cfg = uploadTypeConfig[item._type] || uploadTypeConfig.prestasi;
              return (
                <div key={`${item._type}-${item.id}`} className="bg-white rounded-xl border border-zinc-100 px-4 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <p className="text-xs font-bold text-zinc-900 truncate">{item.title}</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{formatDate(item.created_at)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Two columns: jadwal + pengeluaran */}
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
            <p className="text-[11px] text-zinc-400">Subscribe ke kalender Komprestasi</p>
            <Link to="/dashboard/jadwal" className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-royal-600 hover:underline">
              Lihat tutorial <ArrowRight size={10} />
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
          {pengeluaran.length === 0 ? (
            <div className="text-center py-4">
              <Wallet size={22} className="text-zinc-200 mx-auto mb-2" />
              <p className="text-[11px] text-zinc-400">Belum ada pengeluaran</p>
              <Link to="/dashboard/pengeluaran" className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-royal-600 hover:underline">
                Catat pertama <ArrowRight size={10} />
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              <p className="text-[10px] font-bold text-zinc-400">
                Total bulan ini: <span className="text-emerald-600 font-black">Rp {fmt(totalMonth)}</span>
              </p>
              {pengeluaran.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-900 truncate">{item.name}</p>
                    <p className="text-[10px] text-zinc-400">{formatDate(item.date)}</p>
                  </div>
                  <p className="text-xs font-bold text-zinc-700 flex-shrink-0">Rp {fmt(item.amount)}</p>
                </div>
              ))}
              <Link to="/dashboard/pengeluaran" className="inline-flex items-center gap-1 pt-1 text-[10px] font-bold text-royal-600 hover:underline">
                Lihat semua <ArrowRight size={10} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
