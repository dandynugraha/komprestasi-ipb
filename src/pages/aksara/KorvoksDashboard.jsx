import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Trophy, Activity, Folder, FileText, CalendarDays, Brush, Filter } from "lucide-react";

const tabs = [
  { id: "prestasi", label: "Prestasi", icon: Trophy },
  { id: "kegiatan", label: "Kegiatan", icon: Activity },
  { id: "project",  label: "Project",  icon: Folder  },
  { id: "lomba",    label: "Status Lomba", icon: FileText },
];

const statItems = [
  { label: "Total upload", value: 0, gradient: "from-teal-500 to-cyan-500",      shadow: "rgba(20,184,166,0.28)"  },
  { label: "Prestasi",     value: 0, gradient: "from-amber-500 to-amber-400",    shadow: "rgba(245,158,11,0.28)"  },
  { label: "Kegiatan",    value: 0, gradient: "from-emerald-500 to-emerald-400", shadow: "rgba(52,211,153,0.28)"  },
  { label: "Project",     value: 0, gradient: "from-blue-500 to-blue-400",       shadow: "rgba(59,130,246,0.28)"  },
];

export default function KorvoksDashboard() {
  const [activeTab, setActiveTab] = useState("prestasi");

  return (
    <div className="p-5 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-md shadow-teal-500/30">
            <MapPin size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-zinc-900">Korvoks Dashboard</h1>
            <p className="text-[11px] text-zinc-400">Konten dari anggota <span className="font-black text-teal-600">Vokasi</span></p>
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

      {/* Info banner */}
      <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100 flex items-center gap-2.5">
        <MapPin size={14} className="text-teal-500 flex-shrink-0" />
        <p className="text-xs text-teal-700">Dashboard ini menampilkan upload dari anggota <strong>lokasi Vokasi</strong> saja.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {statItems.map((s, i) => (
          <div key={i} className="bg-gradient-to-br from-white to-zinc-50 rounded-xl border border-zinc-100 p-4 shadow-sm card-hover">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-2.5`} style={{ boxShadow: `0 4px 12px ${s.shadow}` }}>
              <span className="text-white text-[10px] font-black">{s.value}</span>
            </div>
            <p className="text-xl font-black text-zinc-900">{s.value}</p>
            <p className="text-[9px] text-zinc-400 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 mb-5 overflow-x-auto hide-scrollbar">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black transition-all whitespace-nowrap ${
              activeTab === t.id
                ? "text-white shadow-md shadow-teal-600/25"
                : "bg-white text-zinc-500 border border-zinc-200 hover:bg-zinc-50"
            }`}
            style={activeTab === t.id ? { background: "linear-gradient(135deg, #0D9488, #0891B2)" } : {}}
          >
            <t.icon size={13} /> {t.label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div className="relative flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-zinc-100 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: "radial-gradient(circle, #0D9488 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }} />
        <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-teal-50 to-white flex items-center justify-center mb-3 shadow-sm border border-teal-100/50">
          <MapPin size={24} className="text-teal-300" />
        </div>
        <p className="relative text-sm font-black text-zinc-300">Belum ada {activeTab}</p>
        <p className="relative text-[11px] text-zinc-300 mt-1">Upload dari Rona Vokasi akan muncul di sini</p>
      </div>
    </div>
  );
}
