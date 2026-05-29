import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Bell, Filter, Trophy, Activity, Folder, CalendarDays, Brush, Upload } from "lucide-react";

const filterOptions = [
  { id: "all",      label: "Semua"        },
  { id: "prestasi", label: "Prestasi"     },
  { id: "kegiatan", label: "Kegiatan"    },
  { id: "project",  label: "Project"     },
  { id: "event",    label: "Event"       },
  { id: "desain",   label: "Pesen Desain"},
];

const statItems = [
  { label: "Total upload",  value: 0, gradient: "from-royal-500 to-royal-400",    shadow: "rgba(74,31,181,0.28)",   icon: Upload      },
  { label: "Event dibuat",  value: 0, gradient: "from-emerald-500 to-emerald-400",shadow: "rgba(52,211,153,0.28)",  icon: CalendarDays },
  { label: "Pesen desain",  value: 0, gradient: "from-violet-500 to-violet-400",  shadow: "rgba(139,92,246,0.28)",  icon: Brush       },
  { label: "Anggota aktif", value: 0, gradient: "from-amber-500 to-amber-400",    shadow: "rgba(245,158,11,0.28)",  icon: Trophy      },
];

export default function BPHDashboard() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-600 to-zinc-800 flex items-center justify-center shadow-md shadow-zinc-700/30">
          <Eye size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-black text-zinc-900">BPH Dashboard</h1>
          <p className="text-[11px] text-zinc-400">Read-only — feed notifikasi dari semua divisi</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 flex items-center gap-2.5">
        <Eye size={14} className="text-zinc-400 flex-shrink-0" />
        <p className="text-xs text-zinc-300">
          BPH hanya bisa <strong className="text-white">melihat</strong> aktivitas. Semua aksi dilakukan oleh divisi terkait.
        </p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-1.5 mb-5 overflow-x-auto hide-scrollbar">
        <Filter size={12} className="text-zinc-400 flex-shrink-0 mr-1" />
        {filterOptions.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all whitespace-nowrap ${
              filter === f.id
                ? "bg-zinc-900 text-white shadow-sm"
                : "bg-white text-zinc-400 border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {statItems.map((s, i) => (
          <div key={i} className="bg-gradient-to-br from-white to-zinc-50 rounded-xl border border-zinc-100 p-4 shadow-sm card-hover">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-2.5`} style={{ boxShadow: `0 4px 12px ${s.shadow}` }}>
              <s.icon size={13} className="text-white" />
            </div>
            <p className="text-xl font-black text-zinc-900">{s.value}</p>
            <p className="text-[9px] text-zinc-400 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Feed — empty state */}
      <div className="relative flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-zinc-100 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: "radial-gradient(circle, #71717A 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }} />
        <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-zinc-100 to-white flex items-center justify-center mb-3 shadow-sm border border-zinc-200/60">
          <Bell size={24} className="text-zinc-300" />
        </div>
        <p className="relative text-sm font-black text-zinc-300">Belum ada aktivitas</p>
        <p className="relative text-[11px] text-zinc-300 mt-1">Notifikasi dari semua divisi akan muncul di sini</p>
      </div>
    </div>
  );
}
