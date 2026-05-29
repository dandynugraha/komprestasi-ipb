import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, CalendarDays, Star, BarChart3, Brush, Trophy } from "lucide-react";

const statItems = [
  { label: "Total registrasi", value: 0, gradient: "from-pink-500 to-rose-500",    shadow: "rgba(244,63,94,0.28)"  },
  { label: "Event aktif",      value: 0, gradient: "from-emerald-500 to-emerald-400",shadow:"rgba(52,211,153,0.28)"},
  { label: "Avg skor",         value: "—",gradient:"from-amber-500 to-amber-400",    shadow:"rgba(245,158,11,0.28)"},
  { label: "Ikut lomba",       value: "—",gradient:"from-royal-500 to-royal-400",    shadow:"rgba(74,31,181,0.28)" },
];

export default function HEGDashboard() {
  const [activeTab, setActiveTab] = useState("registrations");

  return (
    <div className="p-5 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-md shadow-rose-500/30">
            <Users size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-zinc-900">HEG Dashboard</h1>
            <p className="text-[11px] text-zinc-400">HR — registrasi, skor keaktifan, event</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/dashboard/create-event" className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold hover:bg-emerald-100 transition-colors card-lift border border-emerald-100/60">
            <CalendarDays size={13} /> Buat Event
          </Link>
          <Link to="/dashboard/pesen-desain" className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-royal-50 text-royal-700 text-[11px] font-bold hover:bg-royal-100 transition-colors card-lift border border-royal-100/60">
            <Brush size={13} /> Pesen Desain
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {statItems.map((s, i) => (
          <div key={i} className="bg-gradient-to-br from-white to-zinc-50 rounded-xl border border-zinc-100 p-4 shadow-sm card-hover">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-2.5`} style={{ boxShadow: `0 4px 12px ${s.shadow}` }}>
              <span className="text-white text-[9px] font-black">{typeof s.value === "number" ? s.value : "?"}</span>
            </div>
            <p className="text-xl font-black text-zinc-900">{s.value}</p>
            <p className="text-[9px] text-zinc-400 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-5">
        {["registrations", "members"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2.5 rounded-lg text-xs font-black transition-all ${
              activeTab === t
                ? "text-white shadow-md shadow-royal-600/25"
                : "bg-white text-zinc-500 border border-zinc-200 hover:bg-zinc-50"
            }`}
            style={activeTab === t ? { background: "linear-gradient(135deg, #6231D4, #4A1FB5)" } : {}}
          >
            {t === "registrations" ? "Event Registrations" : "Skor Keaktifan"}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div className="relative flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-zinc-100 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: "radial-gradient(circle, #EC4899 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }} />
        <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-pink-50 to-white flex items-center justify-center mb-3 shadow-sm border border-pink-100/50">
          {activeTab === "registrations" ? <CalendarDays size={24} className="text-pink-300" /> : <Star size={24} className="text-pink-300" />}
        </div>
        <p className="relative text-sm font-black text-zinc-300">
          {activeTab === "registrations" ? "Belum ada registrasi" : "Belum ada data skor"}
        </p>
        <p className="relative text-[11px] text-zinc-300 mt-1">Data akan muncul otomatis</p>
      </div>
    </div>
  );
}
