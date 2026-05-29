import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Database, FileText, Trophy, Activity, Folder, CalendarDays,
  Brush, Filter, Eye, Search,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const tabs = [
  { id: "prestasi", label: "Prestasi", icon: Trophy },
  { id: "kegiatan", label: "Kegiatan", icon: Activity },
  { id: "project", label: "Project", icon: Folder },
  { id: "lomba", label: "Status Lomba", icon: FileText },
];

const statItems = [
  { label: "Total upload", value: 0, gradient: "from-royal-500 to-royal-400",   shadow: "rgba(74,31,181,0.28)"  },
  { label: "Prestasi",     value: 0, gradient: "from-amber-500 to-amber-400",   shadow: "rgba(245,158,11,0.28)" },
  { label: "Kegiatan",    value: 0, gradient: "from-emerald-500 to-emerald-400",shadow: "rgba(52,211,153,0.28)" },
  { label: "Project",     value: 0, gradient: "from-blue-500 to-blue-400",      shadow: "rgba(59,130,246,0.28)" },
];

export default function CDADashboard() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("prestasi");
  const [clusterFilter, setClusterFilter] = useState("all");

  const divisiRaw = profile?.divisi?.toLowerCase() || "";
  let subLabel = "CDA";
  if (divisiRaw.includes("penulisan")) subLabel = "CDA Penulisan";
  else if (divisiRaw.includes("bisnis")) subLabel = "CDA Bisnis";
  else if (divisiRaw.includes("desain")) subLabel = "CDA Desain";
  else if (divisiRaw.includes("olimpiade")) subLabel = "CDA Olimpiade";

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-royal-500 to-royal-600 flex items-center justify-center shadow-md shadow-royal-600/30">
            <Database size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-zinc-900">{subLabel}</h1>
            <p className="text-[11px] text-zinc-400">Content hub — upload dari Rona cluster terkait</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/dashboard/create-event" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-[11px] font-bold hover:bg-emerald-100 transition-colors card-lift border border-emerald-100/60">
            <CalendarDays size={13} /> Buat Event
          </Link>
          <Link to="/dashboard/pesen-desain" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-royal-50 text-royal-700 text-[11px] font-bold hover:bg-royal-100 transition-colors card-lift border border-royal-100/60">
            <Brush size={13} /> Pesen Desain
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {statItems.map((s, i) => (
          <div key={i} className="bg-gradient-to-br from-white to-zinc-50/80 rounded-xl border border-zinc-100 p-4 card-hover shadow-sm">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-2.5`} style={{ boxShadow: `0 4px 12px ${s.shadow}` }}>
              <span className="text-white text-[10px] font-black">{s.value}</span>
            </div>
            <p className="text-xl font-black text-zinc-900">{s.value}</p>
            <p className="text-[9px] text-zinc-400 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 mb-4 overflow-x-auto hide-scrollbar">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === t.id
                ? "text-white shadow-md shadow-royal-600/30"
                : "bg-white text-zinc-500 border border-zinc-100 hover:bg-zinc-50 hover:border-zinc-200"
            }`}
            style={activeTab === t.id ? { background: "linear-gradient(135deg, #6231D4, #4A1FB5)" } : {}}
          >
            <t.icon size={13} /> {t.label}
          </button>
        ))}
      </div>

      {/* Cluster filter */}
      <div className="flex items-center gap-2 mb-5">
        <Filter size={12} className="text-zinc-400" />
        {["all", "Penulisan", "Bisnis", "Desain", "Olimpiade"].map((c) => (
          <button
            key={c}
            onClick={() => setClusterFilter(c)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
              clusterFilter === c
                ? "bg-royal-100 text-royal-700 border border-royal-200"
                : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100 border border-transparent"
            }`}
          >
            {c === "all" ? "Semua" : c}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div className="relative flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-zinc-100 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: "radial-gradient(circle, #4A1FB5 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }} />
        <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-royal-50 to-white flex items-center justify-center mb-3 shadow-sm border border-royal-100/50">
          {activeTab === "prestasi" && <Trophy size={24} className="text-royal-300" />}
          {activeTab === "kegiatan" && <Activity size={24} className="text-royal-300" />}
          {activeTab === "project" && <Folder size={24} className="text-royal-300" />}
          {activeTab === "lomba" && <FileText size={24} className="text-royal-300" />}
        </div>
        <p className="relative text-sm font-black text-zinc-300">Belum ada {activeTab}</p>
        <p className="relative text-[11px] text-zinc-300 mt-1">Upload dari Rona akan otomatis muncul di sini</p>
      </div>
    </div>
  );
}
