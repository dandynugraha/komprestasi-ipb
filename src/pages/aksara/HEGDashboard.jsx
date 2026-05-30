import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, CalendarDays, Star, Brush } from "lucide-react";
import { supabase } from "@/lib/supabase";

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function HEGDashboard() {
  const [activeTab, setActiveTab] = useState("registrations");
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({ totalRegs: 0, activeEvents: 0 });

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    const today = new Date().toISOString().split("T")[0];

    const [
      { count: totalRegs },
      { count: activeEvents },
      { data: regs },
    ] = await Promise.all([
      supabase.from("event_registrations").select("*", { count: "exact", head: true }),
      supabase.from("events").select("*", { count: "exact", head: true }).gte("date", today),
      supabase.from("event_registrations").select("*").order("created_at", { ascending: false }),
    ]);

    setStats({ totalRegs: totalRegs || 0, activeEvents: activeEvents || 0 });

    if (!regs || regs.length === 0) { setRegistrations([]); return; }

    const eventIds = [...new Set(regs.map(r => r.event_id).filter(Boolean))];
    const userIds  = [...new Set(regs.map(r => r.user_id).filter(Boolean))];

    const [{ data: events }, { data: users }] = await Promise.all([
      eventIds.length > 0 ? supabase.from("events").select("id, title, date").in("id", eventIds) : Promise.resolve({ data: [] }),
      userIds.length  > 0 ? supabase.from("users").select("id, name").in("id", userIds)          : Promise.resolve({ data: [] }),
    ]);

    const eventMap = {};
    (events || []).forEach(e => { eventMap[e.id] = e; });
    const userMap = {};
    (users || []).forEach(u => { userMap[u.id] = u.name; });

    setRegistrations(regs.map(r => ({
      ...r,
      event: eventMap[r.event_id] || null,
      user_name: userMap[r.user_id] || "Unknown",
    })));
  }

  const statItems = [
    { label: "Total registrasi", value: stats.totalRegs,    gradient: "from-pink-500 to-rose-500",     shadow: "rgba(244,63,94,0.28)"   },
    { label: "Event aktif",      value: stats.activeEvents, gradient: "from-emerald-500 to-emerald-400",shadow: "rgba(52,211,153,0.28)"  },
    { label: "Avg skor",         value: "—",                gradient: "from-amber-500 to-amber-400",    shadow: "rgba(245,158,11,0.28)"  },
    { label: "Ikut lomba",       value: "—",                gradient: "from-royal-500 to-royal-400",    shadow: "rgba(74,31,181,0.28)"   },
  ];

  return (
    <div className="p-5 sm:p-8">
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

      <div className="flex gap-1.5 mb-5">
        {["registrations", "members"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2.5 rounded-lg text-xs font-black transition-all ${
              activeTab === t ? "text-white shadow-md shadow-royal-600/25" : "bg-white text-zinc-500 border border-zinc-200 hover:bg-zinc-50"
            }`}
            style={activeTab === t ? { background: "linear-gradient(135deg, #6231D4, #4A1FB5)" } : {}}
          >
            {t === "registrations" ? "Event Registrations" : "Skor Keaktifan"}
          </button>
        ))}
      </div>

      {activeTab === "members" ? (
        <div className="relative flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-zinc-100 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, #EC4899 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-pink-50 to-white flex items-center justify-center mb-3 shadow-sm border border-pink-100/50">
            <Star size={24} className="text-pink-300" />
          </div>
          <p className="relative text-sm font-black text-zinc-300">Coming soon</p>
          <p className="relative text-[11px] text-zinc-300 mt-1">Fitur skor keaktifan sedang disiapkan</p>
        </div>
      ) : registrations.length === 0 ? (
        <div className="relative flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-zinc-100 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, #EC4899 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-pink-50 to-white flex items-center justify-center mb-3 shadow-sm border border-pink-100/50">
            <CalendarDays size={24} className="text-pink-300" />
          </div>
          <p className="relative text-sm font-black text-zinc-300">Belum ada registrasi</p>
          <p className="relative text-[11px] text-zinc-300 mt-1">Data akan muncul otomatis</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-zinc-100 overflow-hidden">
          <div className="grid grid-cols-3 px-5 py-2.5 border-b border-zinc-100 bg-zinc-50">
            <span className="text-[10px] font-black text-zinc-400">Nama</span>
            <span className="text-[10px] font-black text-zinc-400">Event</span>
            <span className="text-[10px] font-black text-zinc-400">Tanggal Daftar</span>
          </div>
          {registrations.map(r => (
            <div key={r.id} className="grid grid-cols-3 px-5 py-3 border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 transition-colors">
              <p className="text-xs font-bold text-zinc-900">{r.user_name}</p>
              <p className="text-xs text-zinc-600">{r.event?.title || "—"}</p>
              <p className="text-xs text-zinc-400">{formatDate(r.created_at)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
