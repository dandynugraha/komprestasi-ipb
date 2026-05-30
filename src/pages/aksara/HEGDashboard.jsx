import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, CalendarDays, Star, Brush, ChevronDown, ChevronUp, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function HEGDashboard() {
  const [activeTab, setActiveTab] = useState("events");

  // stats
  const [stats, setStats] = useState({ totalRegs: 0, activeEvents: 0 });

  // tab: events & kehadiran
  const [events, setEvents] = useState([]);
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [eventRegs, setEventRegs] = useState({}); // { [eventId]: [{...reg, user_name}] }
  const [loadingRegs, setLoadingRegs] = useState(false);

  // tab: skor keaktifan
  const [scoreEdits, setScoreEdits] = useState({}); // { [regId]: newScore }
  const [scoreSaving, setScoreSaving] = useState(false);
  const [scoreSavedEvent, setScoreSavedEvent] = useState(null);

  // tab: event registrations
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchEvents();
    fetchRegistrations();
  }, []);

  async function fetchStats() {
    const today = new Date().toISOString().split("T")[0];
    const [{ count: totalRegs }, { count: activeEvents }] = await Promise.all([
      supabase.from("event_registrations").select("*", { count: "exact", head: true }),
      supabase.from("events").select("*", { count: "exact", head: true }).gte("date", today),
    ]);
    setStats({ totalRegs: totalRegs || 0, activeEvents: activeEvents || 0 });
  }

  async function fetchEvents() {
    const { data } = await supabase
      .from("events")
      .select("*")
      .in("visibility", ["internal", "eksternal"])
      .order("date", { ascending: false });
    setEvents(data || []);
  }

  async function fetchRegistrations() {
    const { data: regs } = await supabase
      .from("event_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (!regs || regs.length === 0) { setRegistrations([]); return; }

    const eventIds = [...new Set(regs.map(r => r.event_id).filter(Boolean))];
    const userIds  = [...new Set(regs.map(r => r.user_id).filter(Boolean))];

    const [{ data: evts }, { data: users }] = await Promise.all([
      eventIds.length > 0 ? supabase.from("events").select("id, title, date").in("id", eventIds) : Promise.resolve({ data: [] }),
      userIds.length  > 0 ? supabase.from("users").select("id, name").in("id", userIds)          : Promise.resolve({ data: [] }),
    ]);

    const eventMap = {};
    (evts || []).forEach(e => { eventMap[e.id] = e; });
    const userMap = {};
    (users || []).forEach(u => { userMap[u.id] = u.name; });

    setRegistrations(regs.map(r => ({
      ...r,
      event: eventMap[r.event_id] || null,
      user_name: userMap[r.user_id] || "Unknown",
    })));
  }

  async function fetchEventRegs(eventId) {
    if (eventRegs[eventId]) return;
    setLoadingRegs(true);
    const { data: regs } = await supabase
      .from("event_registrations")
      .select("*")
      .eq("event_id", eventId);

    if (!regs || regs.length === 0) {
      setEventRegs(prev => ({ ...prev, [eventId]: [] }));
      setLoadingRegs(false);
      return;
    }

    const userIds = [...new Set(regs.map(r => r.user_id).filter(Boolean))];
    const { data: users } = userIds.length > 0
      ? await supabase.from("users").select("id, name").in("id", userIds)
      : { data: [] };

    const userMap = {};
    (users || []).forEach(u => { userMap[u.id] = u.name; });

    setEventRegs(prev => ({
      ...prev,
      [eventId]: regs.map(r => ({ ...r, user_name: userMap[r.user_id] || "Unknown" })),
    }));
    setLoadingRegs(false);
  }

  function handleExpandEvent(eventId) {
    if (expandedEventId === eventId) {
      setExpandedEventId(null);
    } else {
      setExpandedEventId(eventId);
      fetchEventRegs(eventId);
    }
  }

  async function toggleAttendance(reg) {
    const newVal = !reg.attended;
    await supabase.from("event_registrations").update({ attended: newVal }).eq("id", reg.id);
    setEventRegs(prev => ({
      ...prev,
      [reg.event_id]: (prev[reg.event_id] || []).map(r =>
        r.id === reg.id ? { ...r, attended: newVal } : r
      ),
    }));
  }

  function handleScoreChange(regId, value) {
    const num = Math.min(100, Math.max(0, parseInt(value, 10) || 0));
    setScoreEdits(prev => ({ ...prev, [regId]: num }));
  }

  async function saveScores(eventId) {
    const regs = eventRegs[eventId] || [];
    const toUpdate = regs.filter(r => scoreEdits[r.id] !== undefined);
    if (toUpdate.length === 0) return;
    setScoreSaving(true);
    await Promise.all(
      toUpdate.map(r =>
        supabase.from("event_registrations").update({ score: scoreEdits[r.id] }).eq("id", r.id)
      )
    );
    setEventRegs(prev => ({
      ...prev,
      [eventId]: (prev[eventId] || []).map(r =>
        scoreEdits[r.id] !== undefined ? { ...r, score: scoreEdits[r.id] } : r
      ),
    }));
    const newEdits = { ...scoreEdits };
    toUpdate.forEach(r => delete newEdits[r.id]);
    setScoreEdits(newEdits);
    setScoreSaving(false);
    setScoreSavedEvent(eventId);
    setTimeout(() => setScoreSavedEvent(null), 2000);
  }

  function avgScore(regs) {
    if (!regs || regs.length === 0) return null;
    const total = regs.reduce((s, r) => s + (r.score || 0), 0);
    return (total / regs.length).toFixed(1);
  }

  const statItems = [
    { label: "Total registrasi", value: stats.totalRegs,    gradient: "from-pink-500 to-rose-500",      shadow: "rgba(244,63,94,0.28)"  },
    { label: "Event aktif",      value: stats.activeEvents, gradient: "from-emerald-500 to-emerald-400", shadow: "rgba(52,211,153,0.28)" },
    { label: "Total event",      value: events.length,      gradient: "from-amber-500 to-amber-400",     shadow: "rgba(245,158,11,0.28)" },
    { label: "Registrations",   value: registrations.length,gradient: "from-royal-500 to-royal-400",    shadow: "rgba(74,31,181,0.28)"  },
  ];

  const tabs = [
    { key: "events",        label: "Event & Kehadiran" },
    { key: "scores",        label: "Skor Keaktifan" },
    { key: "registrations", label: "Event Registrations" },
  ];

  function EventCard({ event, mode }) {
    const regs = eventRegs[event.id] || [];
    const isExpanded = expandedEventId === event.id;

    return (
      <div className="bg-white rounded-xl border border-zinc-200 p-4">
        <div
          className="cursor-pointer flex items-start justify-between gap-3"
          onClick={() => handleExpandEvent(event.id)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-zinc-900">{event.title}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                event.visibility === "internal"
                  ? "bg-royal-50 text-royal-600"
                  : "bg-amber-50 text-amber-600"
              }`}>
                {event.visibility}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">{formatDate(event.date)} · {event.location}</p>
            {isExpanded && regs.length > 0 && (
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {regs.length} peserta
                {mode === "scores" && avgScore(regs) !== null && ` · Rata-rata: ${avgScore(regs)}`}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 text-zinc-400">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>

        {isExpanded && (
          <div className="bg-zinc-50 rounded-lg p-4 mt-3">
            {loadingRegs && !eventRegs[event.id] ? (
              <p className="text-xs text-zinc-400 text-center py-4">Memuat...</p>
            ) : regs.length === 0 ? (
              <p className="text-xs text-zinc-400 text-center py-4">Belum ada peserta</p>
            ) : (
              <>
                {regs.map((reg) => (
                  <div key={reg.id} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                    <p className="text-sm font-bold text-zinc-900">{reg.user_name}</p>
                    {mode === "attendance" ? (
                      <button
                        onClick={() => toggleAttendance(reg)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          reg.attended
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                        }`}
                      >
                        {reg.attended ? <><Check size={12} /> Hadir</> : <><X size={12} /> Tidak Hadir</>}
                      </button>
                    ) : (
                      <input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="0"
                        value={scoreEdits[reg.id] !== undefined ? scoreEdits[reg.id] : (reg.score || "")}
                        onChange={(e) => handleScoreChange(reg.id, e.target.value)}
                        className="w-20 px-3 py-1.5 rounded-lg border border-zinc-200 text-center text-sm focus:outline-none focus:border-royal-400 focus:ring-1 focus:ring-royal-400"
                      />
                    )}
                  </div>
                ))}

                {mode === "scores" && (
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => saveScores(event.id)}
                      disabled={scoreSaving}
                      className="bg-royal-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-royal-700 disabled:opacity-60 transition-colors"
                    >
                      {scoreSaving ? "Menyimpan..." : "Simpan Skor"}
                    </button>
                    {scoreSavedEvent === event.id && (
                      <span className="text-xs font-bold text-emerald-600">Skor tersimpan!</span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  }

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
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Link to="/dashboard/create-lomba-info" className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-50 text-amber-700 text-[11px] font-bold hover:bg-amber-100 transition-colors card-lift border border-amber-100/60">
            <Star size={13} /> Upload Info Lomba
          </Link>
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

      <div className="flex gap-1.5 mb-5 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2.5 rounded-lg text-xs font-black transition-all ${
              activeTab === t.key ? "text-white shadow-md shadow-royal-600/25" : "bg-white text-zinc-500 border border-zinc-200 hover:bg-zinc-50"
            }`}
            style={activeTab === t.key ? { background: "linear-gradient(135deg, #6231D4, #4A1FB5)" } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "events" && (
        events.length === 0 ? (
          <div className="relative flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-zinc-100 overflow-hidden">
            <CalendarDays size={24} className="text-zinc-200 mb-2" />
            <p className="text-sm font-black text-zinc-300">Belum ada event</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map(ev => <EventCard key={ev.id} event={ev} mode="attendance" />)}
          </div>
        )
      )}

      {activeTab === "scores" && (
        events.length === 0 ? (
          <div className="relative flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-zinc-100 overflow-hidden">
            <Star size={24} className="text-zinc-200 mb-2" />
            <p className="text-sm font-black text-zinc-300">Belum ada event</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map(ev => <EventCard key={ev.id} event={ev} mode="scores" />)}
          </div>
        )
      )}

      {activeTab === "registrations" && (
        registrations.length === 0 ? (
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
        )
      )}
    </div>
  );
}
