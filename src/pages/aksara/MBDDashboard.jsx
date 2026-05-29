import { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Clock, Play, RotateCcw, CheckCircle } from "lucide-react";

const columns = [
  { id: "Pending",     icon: Clock,        gradient: "from-zinc-400 to-zinc-500",    shadow: "rgba(113,113,122,0.25)" },
  { id: "In Progress", icon: Play,         gradient: "from-blue-400 to-blue-500",    shadow: "rgba(59,130,246,0.28)"  },
  { id: "Revision",   icon: RotateCcw,    gradient: "from-amber-400 to-amber-500",  shadow: "rgba(245,158,11,0.28)"  },
  { id: "Done",       icon: CheckCircle,  gradient: "from-emerald-400 to-emerald-500",shadow:"rgba(52,211,153,0.28)" },
];

export default function MBDDashboard() {
  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-500/30">
          <Palette size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-black text-zinc-900">MBD Dashboard</h1>
          <p className="text-[11px] text-zinc-400">Kanban — permintaan desain dari CDA, HEG, Korvoks</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {columns.map((col) => (
          <div key={col.id} className="bg-gradient-to-br from-white to-zinc-50 rounded-xl border border-zinc-100 p-4 text-center shadow-sm card-hover">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${col.gradient} flex items-center justify-center mx-auto mb-2.5`} style={{ boxShadow: `0 4px 12px ${col.shadow}` }}>
              <col.icon size={15} className="text-white" />
            </div>
            <p className="text-xl font-black text-zinc-900">0</p>
            <p className="text-[9px] text-zinc-400 font-medium">{col.id}</p>
          </div>
        ))}
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {columns.map((col) => (
          <div key={col.id}>
            <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl mb-3 bg-gradient-to-r ${col.gradient} shadow-sm`}>
              <col.icon size={13} className="text-white" />
              <span className="text-xs font-black text-white">{col.id}</span>
              <span className="ml-auto text-[10px] font-black text-white/70 bg-white/20 px-2 py-0.5 rounded-full">0</span>
            </div>
            <div className="py-10 text-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50">
              <p className="text-[10px] font-bold text-zinc-300">Kosong</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
