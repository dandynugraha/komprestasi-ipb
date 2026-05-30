import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Database, FileText, Trophy, Activity, Folder, CalendarDays,
  Brush, Filter, X, ChevronDown, ChevronUp,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

const tabs = [
  { id: "prestasi", label: "Prestasi",     icon: Trophy      },
  { id: "kegiatan", label: "Kegiatan",    icon: Activity     },
  { id: "project",  label: "Project",     icon: Folder      },
  { id: "lomba",    label: "Status Lomba",icon: FileText     },
  { id: "event",    label: "Event",       icon: CalendarDays },
];

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function getClusterFromRole(role) {
  const r = (role || "").toLowerCase();
  if (r.includes("penulisan") || r.includes("olimpiade")) return "Penulisan Ilmiah dan Olimpiade Sains";
  if (r.includes("bisnis")) return "Bisnis dan Analisis Strategi";
  if (r.includes("desain")) return "Desain dan Visual Kreatif";
  return null;
}

function getSubLabel(role) {
  const r = (role || "").toLowerCase();
  if (r.includes("penulisan")) return "CDA Penulisan";
  if (r.includes("olimpiade")) return "CDA Olimpiade";
  if (r.includes("bisnis")) return "CDA Bisnis";
  if (r.includes("desain")) return "CDA Desain";
  return "CDA";
}

function matchesFilter(item, filter) {
  if (filter === "all") return true;
  return (item.cluster || "").toLowerCase().includes(filter.toLowerCase());
}

function ItemDetailModal({ item, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        {item.photo_url && (
          <img src={item.photo_url} alt={item.title} className="w-full h-64 object-cover rounded-t-2xl" />
        )}
        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              {item.status && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">{item.status}</span>
              )}
              {item.cabang && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">{item.cabang}</span>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 hover:bg-zinc-200 transition-colors"
            >
              <X size={14} className="text-zinc-500" />
            </button>
          </div>
          <h2 className="text-base font-black text-zinc-900 leading-snug mb-1">{item.title}</h2>
          {item.users?.name && (
            <p className="text-xs text-zinc-400 mb-4">oleh {item.users.name}</p>
          )}
          {item.storytelling && (
            <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">{item.storytelling}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function CDADashboard() {
  const { profile, user } = useAuth();
  const [activeTab, setActiveTab] = useState("prestasi");
  const [clusterFilter, setClusterFilter] = useState("all");
  const [data, setData] = useState({ prestasi: [], kegiatan: [], project: [], lomba: [] });
  const [events, setEvents] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [eventRegistrants, setEventRegistrants] = useState({});

  const dbCluster = getClusterFromRole(profile?.role);
  const subLabel = getSubLabel(profile?.role);

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (activeTab === "event" && user) fetchEvents();
  }, [activeTab, user?.id]);

  useEffect(() => {
    if (!selectedItem) return;
    window.history.pushState({ modal: true }, '');
    const onPopState = () => setSelectedItem(null);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [selectedItem]);

  async function fetchAll() {
    const buildQuery = (table) => {
      let q = supabase.from(table).select("*, users(name)").order("created_at", { ascending: false });
      if (dbCluster) q = q.eq("cluster", dbCluster);
      return q;
    };

    const [
      { data: prestasi },
      { data: kegiatan },
      { data: project },
      { data: lomba },
    ] = await Promise.all([
      buildQuery("prestasi"),
      buildQuery("kegiatan"),
      buildQuery("projects"),
      buildQuery("lomba"),
    ]);

    setData({
      prestasi: prestasi || [],
      kegiatan: kegiatan || [],
      project: project || [],
      lomba: lomba || [],
    });
  }

  async function fetchEvents() {
    if (!user) return;
    const { data: evs } = await supabase
      .from("events")
      .select("*")
      .eq("created_by", user.id)
      .neq("visibility", "lomba_info")
      .order("date", { ascending: false });

    if (!evs || evs.length === 0) { setEvents([]); return; }

    const enriched = await Promise.all(evs.map(async (ev) => {
      const { count } = await supabase
        .from("event_registrations")
        .select("*", { count: "exact", head: true })
        .eq("event_id", ev.id);
      return { ...ev, registrantCount: count || 0 };
    }));

    setEvents(enriched);
  }

  async function loadRegistrants(eventId) {
    if (eventRegistrants[eventId] !== undefined) return;
    setEventRegistrants(prev => ({ ...prev, [eventId]: null }));

    const { data: regData } = await supabase
      .from("event_registrations")
      .select("user_id")
      .eq("event_id", eventId);

    const userIds = (regData || []).map(r => r.user_id).filter(Boolean);
    if (userIds.length === 0) {
      setEventRegistrants(prev => ({ ...prev, [eventId]: [] }));
      return;
    }

    const { data: usersData } = await supabase
      .from("users")
      .select("name")
      .in("id", userIds);

    setEventRegistrants(prev => ({ ...prev, [eventId]: (usersData || []).map(u => u.name) }));
  }

  function handleExpandEvent(eventId, isInternal) {
    if (expandedEventId === eventId) {
      setExpandedEventId(null);
    } else {
      setExpandedEventId(eventId);
      if (isInternal) loadRegistrants(eventId);
    }
  }

  const filtered = {
    prestasi: data.prestasi.filter(i => matchesFilter(i, clusterFilter)),
    kegiatan: data.kegiatan.filter(i => matchesFilter(i, clusterFilter)),
    project:  data.project.filter(i => matchesFilter(i, clusterFilter)),
    lomba:    data.lomba.filter(i => matchesFilter(i, clusterFilter)),
  };

  const stats = [
    { label: "Total upload", value: filtered.prestasi.length + filtered.kegiatan.length + filtered.project.length, gradient: "from-royal-500 to-royal-400", shadow: "rgba(74,31,181,0.28)" },
    { label: "Prestasi",     value: filtered.prestasi.length, gradient: "from-amber-500 to-amber-400",    shadow: "rgba(245,158,11,0.28)" },
    { label: "Kegiatan",    value: filtered.kegiatan.length, gradient: "from-emerald-500 to-emerald-400", shadow: "rgba(52,211,153,0.28)" },
    { label: "Project",     value: filtered.project.length,  gradient: "from-blue-500 to-blue-400",       shadow: "rgba(59,130,246,0.28)" },
  ];

  const activeItems = filtered[activeTab] || [];

  return (
    <div className="p-4 sm:p-6">
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
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Link to="/dashboard/create-lomba-info" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 text-amber-700 text-[11px] font-bold hover:bg-amber-100 transition-colors card-lift border border-amber-100/60">
            <Trophy size={13} /> Upload Info Lomba
          </Link>
          <Link to="/dashboard/create-event" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-[11px] font-bold hover:bg-emerald-100 transition-colors card-lift border border-emerald-100/60">
            <CalendarDays size={13} /> Buat Event
          </Link>
          <Link to="/dashboard/pesen-desain" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-royal-50 text-royal-700 text-[11px] font-bold hover:bg-royal-100 transition-colors card-lift border border-royal-100/60">
            <Brush size={13} /> Pesen Desain
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-gradient-to-br from-white to-zinc-50/80 rounded-xl border border-zinc-100 p-4 card-hover shadow-sm">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-2.5`} style={{ boxShadow: `0 4px 12px ${s.shadow}` }}>
              <span className="text-white text-[10px] font-black">{s.value}</span>
            </div>
            <p className="text-xl font-black text-zinc-900">{s.value}</p>
            <p className="text-[9px] text-zinc-400 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1.5 mb-4 overflow-x-auto hide-scrollbar">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === t.id ? "text-white shadow-md shadow-royal-600/30" : "bg-white text-zinc-500 border border-zinc-100 hover:bg-zinc-50 hover:border-zinc-200"
            }`}
            style={activeTab === t.id ? { background: "linear-gradient(135deg, #6231D4, #4A1FB5)" } : {}}
          >
            <t.icon size={13} /> {t.label}
          </button>
        ))}
      </div>

      {activeTab !== "event" && (
        <div className="flex items-center gap-2 mb-5">
          <Filter size={12} className="text-zinc-400" />
          {["all", "Penulisan", "Bisnis", "Desain", "Olimpiade"].map((c) => (
            <button
              key={c}
              onClick={() => setClusterFilter(c)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                clusterFilter === c ? "bg-royal-100 text-royal-700 border border-royal-200" : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100 border border-transparent"
              }`}
            >
              {c === "all" ? "Semua" : c}
            </button>
          ))}
        </div>
      )}

      {activeTab === "event" ? (
        <div>
          {events.length === 0 ? (
            <div className="relative flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-zinc-100 overflow-hidden">
              <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, #4A1FB5 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center mb-3 shadow-sm border border-emerald-100/50">
                <CalendarDays size={24} className="text-emerald-300" />
              </div>
              <p className="relative text-sm font-black text-zinc-300">Belum ada event</p>
              <p className="relative text-[11px] text-zinc-300 mt-1">Event yang kamu buat akan muncul di sini</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map(ev => (
                <div key={ev.id} className="bg-white rounded-xl border border-zinc-200 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-zinc-900 text-sm leading-snug">{ev.title}</p>
                      <p className="text-xs text-zinc-400 mt-1">{formatDate(ev.date)}</p>
                      {ev.location && <p className="text-xs text-zinc-400 mt-0.5">{ev.location}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ev.visibility === "internal" ? "bg-zinc-100 text-zinc-600" : "bg-purple-100 text-purple-700"}`}>
                        {ev.visibility === "internal" ? "Internal" : "Eksternal"}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                        {ev.registrantCount} pendaftar
                      </span>
                    </div>
                  </div>
                  {ev.visibility === "internal" && (
                    <button
                      onClick={() => handleExpandEvent(ev.id, true)}
                      className="mt-3 flex items-center gap-1 text-[11px] text-royal-600 font-bold hover:underline"
                    >
                      {expandedEventId === ev.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      {expandedEventId === ev.id ? "Sembunyikan pendaftar" : "Lihat pendaftar"}
                    </button>
                  )}
                  {expandedEventId === ev.id && (
                    <div className="mt-3 pl-3 border-l-2 border-royal-100">
                      {eventRegistrants[ev.id] === null ? (
                        <p className="text-[11px] text-zinc-400">Memuat...</p>
                      ) : eventRegistrants[ev.id]?.length === 0 ? (
                        <p className="text-[11px] text-zinc-400">Belum ada pendaftar</p>
                      ) : (
                        <ul className="space-y-1">
                          {(eventRegistrants[ev.id] || []).map((name, idx) => (
                            <li key={idx} className="text-[11px] text-zinc-600">{idx + 1}. {name}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeItems.length === 0 ? (
        <div className="relative flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-zinc-100 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, #4A1FB5 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-royal-50 to-white flex items-center justify-center mb-3 shadow-sm border border-royal-100/50">
            {activeTab === "prestasi" && <Trophy size={24} className="text-royal-300" />}
            {activeTab === "kegiatan" && <Activity size={24} className="text-royal-300" />}
            {activeTab === "project"  && <Folder size={24} className="text-royal-300" />}
            {activeTab === "lomba"    && <FileText size={24} className="text-royal-300" />}
          </div>
          <p className="relative text-sm font-black text-zinc-300">Belum ada {activeTab}</p>
          <p className="relative text-[11px] text-zinc-300 mt-1">Upload dari Rona akan otomatis muncul di sini</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeItems.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-zinc-200 p-5 cursor-pointer hover:border-royal-200 hover:shadow-md transition-all"
              onClick={() => setSelectedItem(item)}
            >
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

      {selectedItem && (
        <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
