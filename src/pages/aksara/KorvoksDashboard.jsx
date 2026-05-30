import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Trophy, Activity, Folder, FileText, CalendarDays, Brush } from "lucide-react";
import { supabase } from "@/lib/supabase";

const tabs = [
  { id: "prestasi", label: "Prestasi",     icon: Trophy   },
  { id: "kegiatan", label: "Kegiatan",    icon: Activity  },
  { id: "project",  label: "Project",     icon: Folder   },
  { id: "lomba",    label: "Status Lomba",icon: FileText  },
];

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function KorvoksDashboard() {
  const [activeTab, setActiveTab] = useState("prestasi");
  const [data, setData] = useState({ prestasi: [], kegiatan: [], project: [], lomba: [] });

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    const [
      { data: prestasi },
      { data: kegiatan },
      { data: project },
      { data: lomba },
    ] = await Promise.all([
      supabase.from("prestasi").select("*, users(name)").eq("lokasi", "Vokasi").order("created_at", { ascending: false }),
      supabase.from("kegiatan").select("*, users(name)").eq("lokasi", "Vokasi").order("created_at", { ascending: false }),
      supabase.from("projects").select("*, users(name)").eq("lokasi", "Vokasi").order("created_at", { ascending: false }),
      supabase.from("lomba").select("*, users(name)").eq("lokasi", "Vokasi").order("created_at", { ascending: false }),
    ]);

    setData({
      prestasi: prestasi || [],
      kegiatan: kegiatan || [],
      project:  project  || [],
      lomba:    lomba    || [],
    });
  }

  const stats = [
    { label: "Total upload", value: data.prestasi.length + data.kegiatan.length + data.project.length, gradient: "from-teal-500 to-cyan-500",      shadow: "rgba(20,184,166,0.28)"  },
    { label: "Prestasi",     value: data.prestasi.length, gradient: "from-amber-500 to-amber-400",    shadow: "rgba(245,158,11,0.28)"  },
    { label: "Kegiatan",    value: data.kegiatan.length, gradient: "from-emerald-500 to-emerald-400", shadow: "rgba(52,211,153,0.28)"  },
    { label: "Project",     value: data.project.length,  gradient: "from-blue-500 to-blue-400",       shadow: "rgba(59,130,246,0.28)"  },
  ];

  const activeItems = data[activeTab] || [];

  return (
    <div className="p-5 sm:p-8">
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

      <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100 flex items-center gap-2.5">
        <MapPin size={14} className="text-teal-500 flex-shrink-0" />
        <p className="text-xs text-teal-700">Dashboard ini menampilkan upload dari anggota <strong>lokasi Vokasi</strong> saja.</p>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-5">
        {stats.map((s, i) => (
          <div key={i} className="bg-gradient-to-br from-white to-zinc-50 rounded-xl border border-zinc-100 p-4 shadow-sm card-hover text-center">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-2.5 mx-auto`} style={{ boxShadow: `0 4px 12px ${s.shadow}` }}>
              <span className="text-white text-[10px] font-black">{s.value}</span>
            </div>
            <p className="text-xl font-black text-zinc-900">{s.value}</p>
            <p className="text-[9px] text-zinc-400 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1.5 mb-5 overflow-x-auto hide-scrollbar">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black transition-all whitespace-nowrap ${
              activeTab === t.id ? "text-white shadow-md shadow-teal-600/25" : "bg-white text-zinc-500 border border-zinc-200 hover:bg-zinc-50"
            }`}
            style={activeTab === t.id ? { background: "linear-gradient(135deg, #0D9488, #0891B2)" } : {}}
          >
            <t.icon size={13} /> {t.label}
          </button>
        ))}
      </div>

      {activeItems.length === 0 ? (
        <div className="relative flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-zinc-100 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, #0D9488 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-teal-50 to-white flex items-center justify-center mb-3 shadow-sm border border-teal-100/50">
            <MapPin size={24} className="text-teal-300" />
          </div>
          <p className="relative text-sm font-black text-zinc-300">Belum ada {activeTab}</p>
          <p className="relative text-[11px] text-zinc-300 mt-1">Upload dari Rona Vokasi akan muncul di sini</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeItems.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-zinc-200 p-5">
              {item.photo_url && (
                <img src={item.photo_url} alt={item.title} className="w-full h-32 object-cover rounded-lg mb-3" />
              )}
              <p className="font-bold text-zinc-900 text-sm leading-snug">{item.title}</p>
              {(item.cabang || item.status) && (
                <p className="text-xs text-zinc-400 mt-1">{item.cabang}{item.cabang && item.status ? " · " : ""}{item.status}</p>
              )}
              <p className="text-[10px] text-zinc-300 mt-1">{formatDate(item.created_at)}</p>
              {item.users?.name && (
                <p className="text-xs text-zinc-400 mt-0.5">oleh {item.users.name}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
