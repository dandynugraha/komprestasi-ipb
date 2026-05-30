import { useState, useEffect } from "react";
import { Eye, Bell, Filter, Trophy, Activity, Folder, CalendarDays, Brush, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";

const filterOptions = [
  { id: "all",      label: "Semua"        },
  { id: "prestasi", label: "Prestasi"     },
  { id: "kegiatan", label: "Kegiatan"    },
  { id: "project",  label: "Project"     },
  { id: "event",    label: "Event"       },
  { id: "desain",   label: "Pesen Desain"},
];

const typeConfig = {
  prestasi: { icon: Trophy,     color: "bg-amber-100 text-amber-700",    label: "Prestasi"     },
  kegiatan: { icon: Activity,   color: "bg-emerald-100 text-emerald-700",label: "Kegiatan"    },
  project:  { icon: Folder,     color: "bg-blue-100 text-blue-700",      label: "Project"     },
  event:    { icon: CalendarDays,color:"bg-royal-100 text-royal-700",    label: "Event"       },
  desain:   { icon: Brush,      color: "bg-violet-100 text-violet-700",  label: "Pesen Desain"},
};

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function BPHDashboard() {
  const [filter, setFilter] = useState("all");
  const [feed, setFeed] = useState([]);
  const [stats, setStats] = useState({ totalUpload: 0, eventDibuat: 0, pesenDesain: 0, anggotaAktif: 0 });

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    const [
      { data: prestasi },
      { data: kegiatan },
      { data: project },
      { data: event },
      { data: desain },
      { count: prestasiCount },
      { count: kegiatanCount },
      { count: eventCount },
      { count: desainCount },
      { count: userCount },
    ] = await Promise.all([
      supabase.from("prestasi").select("id, title, created_at, users(name)").order("created_at", { ascending: false }).limit(10),
      supabase.from("kegiatan").select("id, title, created_at, users(name)").order("created_at", { ascending: false }).limit(10),
      supabase.from("projects").select("id, title, created_at, users(name)").order("created_at", { ascending: false }).limit(10),
      supabase.from("events").select("id, title, created_at, users!created_by(name)").order("created_at", { ascending: false }).limit(10),
      supabase.from("pesen_desain").select("id, title, created_at, status, users(name)").order("created_at", { ascending: false }).limit(10),
      supabase.from("prestasi").select("*", { count: "exact", head: true }),
      supabase.from("kegiatan").select("*", { count: "exact", head: true }),
      supabase.from("events").select("*", { count: "exact", head: true }),
      supabase.from("pesen_desain").select("*", { count: "exact", head: true }),
      supabase.from("users").select("*", { count: "exact", head: true }),
    ]);

    const merged = [
      ...(prestasi || []).map(i => ({ ...i, _type: "prestasi", _uploaderName: i.users?.name })),
      ...(kegiatan || []).map(i => ({ ...i, _type: "kegiatan", _uploaderName: i.users?.name })),
      ...(project  || []).map(i => ({ ...i, _type: "project",  _uploaderName: i.users?.name })),
      ...(event    || []).map(i => ({ ...i, _type: "event",    _uploaderName: i.users?.name })),
      ...(desain   || []).map(i => ({ ...i, _type: "desain",   _uploaderName: i.users?.name })),
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setFeed(merged);
    setStats({
      totalUpload:  (prestasiCount || 0) + (kegiatanCount || 0),
      eventDibuat:  eventCount    || 0,
      pesenDesain:  desainCount   || 0,
      anggotaAktif: userCount     || 0,
    });
  }

  const statItems = [
    { label: "Total upload",  value: stats.totalUpload,  gradient: "from-royal-500 to-royal-400",    shadow: "rgba(74,31,181,0.28)",  icon: Upload      },
    { label: "Event dibuat",  value: stats.eventDibuat,  gradient: "from-emerald-500 to-emerald-400",shadow: "rgba(52,211,153,0.28)", icon: CalendarDays },
    { label: "Pesen desain",  value: stats.pesenDesain,  gradient: "from-violet-500 to-violet-400",  shadow: "rgba(139,92,246,0.28)", icon: Brush       },
    { label: "Anggota aktif", value: stats.anggotaAktif, gradient: "from-amber-500 to-amber-400",    shadow: "rgba(245,158,11,0.28)", icon: Trophy      },
  ];

  const displayed = filter === "all" ? feed : feed.filter(i => i._type === filter);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-600 to-zinc-800 flex items-center justify-center shadow-md shadow-zinc-700/30">
          <Eye size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-black text-zinc-900">BPH Dashboard</h1>
          <p className="text-[11px] text-zinc-400">Read-only — feed notifikasi dari semua divisi</p>
        </div>
      </div>

      <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 flex items-center gap-2.5">
        <Eye size={14} className="text-zinc-400 flex-shrink-0" />
        <p className="text-xs text-zinc-300">
          BPH hanya bisa <strong className="text-white">melihat</strong> aktivitas. Semua aksi dilakukan oleh divisi terkait.
        </p>
      </div>

      <div className="flex items-center gap-1.5 mb-5 overflow-x-auto hide-scrollbar">
        <Filter size={12} className="text-zinc-400 flex-shrink-0 mr-1" />
        {filterOptions.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all whitespace-nowrap ${
              filter === f.id ? "bg-zinc-900 text-white shadow-sm" : "bg-white text-zinc-400 border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2 mb-6">
        {statItems.map((s, i) => (
          <div key={i} className="bg-gradient-to-br from-white to-zinc-50 rounded-xl border border-zinc-100 p-4 shadow-sm card-hover text-center">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-2.5 mx-auto`} style={{ boxShadow: `0 4px 12px ${s.shadow}` }}>
              <s.icon size={13} className="text-white" />
            </div>
            <p className="text-xl font-black text-zinc-900">{s.value}</p>
            <p className="text-[9px] text-zinc-400 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className="relative flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-zinc-100 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, #71717A 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
          <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-zinc-100 to-white flex items-center justify-center mb-3 shadow-sm border border-zinc-200/60">
            <Bell size={24} className="text-zinc-300" />
          </div>
          <p className="relative text-sm font-black text-zinc-300">Belum ada aktivitas</p>
          <p className="relative text-[11px] text-zinc-300 mt-1">Notifikasi dari semua divisi akan muncul di sini</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-zinc-100 divide-y divide-zinc-100">
          {displayed.map((item, i) => {
            const cfg = typeConfig[item._type] || typeConfig.project;
            const Icon = cfg.icon;
            return (
              <div key={`${item._type}-${item.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-50/50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-zinc-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-zinc-900 truncate">{item.title}</p>
                  <p className="text-[10px] text-zinc-400">
                    {formatDate(item.created_at)}
                    {item._uploaderName ? ` · oleh ${item._uploaderName}` : ""}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.color}`}>
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
