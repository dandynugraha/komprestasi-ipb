import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Search, MapPin, Clock, X, ExternalLink, CheckCircle, Lock } from "lucide-react";
import siteConfig from "@/config/site.config";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { parseDescription } from "@/lib/eventUtils";

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function formatTime(t) {
  if (!t) return null;
  return t.slice(0, 5);
}

function EventDetailModal({ event, isInternal, isRegistered, onRegister, registering, user, onClose }) {
  const { imageUrl, gformUrl, text } = parseDescription(event.description);
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
        {imageUrl && (
          <img src={imageUrl} alt={event.title} className="w-full h-52 object-cover rounded-t-2xl" />
        )}
        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isInternal ? "bg-royal-100 text-royal-700" : "bg-emerald-100 text-emerald-700"
              }`}>
                {isInternal ? "Internal" : "Eksternal"}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 hover:bg-zinc-200 transition-colors"
            >
              <X size={14} className="text-zinc-500" />
            </button>
          </div>
          <h2 className="text-base font-black text-zinc-900 leading-snug mt-2 mb-4">{event.title}</h2>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <CalendarDays size={13} className="text-emerald-500 flex-shrink-0" />
              {formatDate(event.date)}
            </div>
            {(event.time_start || event.time_end) && (
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Clock size={13} className="text-emerald-500 flex-shrink-0" />
                {formatTime(event.time_start)}{event.time_end ? ` – ${formatTime(event.time_end)}` : ""}
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <MapPin size={13} className="text-emerald-500 flex-shrink-0" />
                {event.location}
              </div>
            )}
          </div>
          {text && (
            <p className="text-sm text-zinc-600 leading-relaxed mb-5 whitespace-pre-line">{text}</p>
          )}

          {/* Eksternal: link Google Form */}
          {!isInternal && gformUrl && (
            <a
              href={gformUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors"
            >
              <ExternalLink size={14} /> Daftar Sekarang
            </a>
          )}

          {/* Internal: tombol daftar ke DB */}
          {isInternal && user && (
            isRegistered ? (
              <div className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-200">
                <CheckCircle size={14} /> Sudah Terdaftar
              </div>
            ) : (
              <button
                onClick={() => onRegister(event.id)}
                disabled={registering}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-royal-600 text-white text-sm font-bold hover:bg-royal-700 disabled:opacity-60 transition-colors"
              >
                {registering ? "Mendaftar..." : "Daftar"}
              </button>
            )
          )}
          {isInternal && !user && (
            <div className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-zinc-50 text-zinc-400 text-sm font-bold border border-zinc-200">
              <Lock size={14} /> Login untuk daftar
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function EventCard({ event, isInternal, isRegistered, registering, onRegister, user, onOpen }) {
  const { gformUrl, text } = parseDescription(event.description);
  return (
    <div
      className="bg-white rounded-xl border border-zinc-200 p-5 flex flex-col gap-3 cursor-pointer hover:border-emerald-200 hover:shadow-md transition-all"
      onClick={onOpen}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <CalendarDays size={18} className="text-emerald-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
              isInternal ? "bg-royal-100 text-royal-700" : "bg-emerald-100 text-emerald-700"
            }`}>
              {isInternal ? "Internal" : "Eksternal"}
            </span>
          </div>
          <p className="font-bold text-zinc-900 text-sm leading-snug">{event.title}</p>
          <p className="text-xs text-emerald-600 font-medium mt-0.5">{formatDate(event.date)}</p>
          {event.location && (
            <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1">
              <MapPin size={10} className="flex-shrink-0" /> {event.location}
            </p>
          )}
          {text && (
            <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2">{text}</p>
          )}
        </div>
      </div>

      {/* Tombol daftar */}
      {!isInternal && gformUrl && (
        <a
          href={gformUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
        >
          <ExternalLink size={11} /> Daftar
        </a>
      )}
      {isInternal && user && (
        isRegistered ? (
          <div
            className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200"
            onClick={(e) => e.stopPropagation()}
          >
            <CheckCircle size={11} /> Sudah Terdaftar
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onRegister(event.id); }}
            disabled={registering}
            className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-royal-600 text-white text-xs font-bold hover:bg-royal-700 disabled:opacity-60 transition-colors"
          >
            {registering ? "Mendaftar..." : "Daftar"}
          </button>
        )
      )}
    </div>
  );
}

export default function EventPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [extEvents, setExtEvents] = useState([]);
  const [intEvents, setIntEvents] = useState([]);
  const [registrations, setRegistrations] = useState(new Set());
  const [registering, setRegistering] = useState(new Set());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [user?.id]);

  async function fetchEvents() {
    setLoading(true);
    try {
      const [{ data: ext }, { data: intEvt }] = await Promise.all([
        supabase
          .from("events")
          .select("id, title, date, time_start, time_end, location, description, visibility")
          .eq("visibility", "eksternal")
          .order("date", { ascending: true }),
        user
          ? supabase
              .from("events")
              .select("id, title, date, time_start, time_end, location, description, visibility")
              .eq("visibility", "internal")
              .order("date", { ascending: true })
          : Promise.resolve({ data: [] }),
      ]);

      setExtEvents(ext || []);
      const internal = intEvt || [];
      setIntEvents(internal);

      if (user && internal.length > 0) {
        const { data: regs } = await supabase
          .from("event_registrations")
          .select("event_id")
          .eq("user_id", user.id)
          .in("event_id", internal.map(e => e.id));
        setRegistrations(new Set((regs || []).map(r => r.event_id)));
      }
    } catch (err) {
      console.error("fetchEvents error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(eventId) {
    if (!user) return;
    setRegistering(prev => new Set([...prev, eventId]));
    try {
      const { error } = await supabase
        .from("event_registrations")
        .insert({ event_id: eventId, user_id: user.id });
      if (!error) {
        setRegistrations(prev => new Set([...prev, eventId]));
        if (selectedEvent?.id === eventId) {
          setSelectedEvent(prev => ({ ...prev, _justRegistered: true }));
        }
      }
    } finally {
      setRegistering(prev => { const s = new Set(prev); s.delete(eventId); return s; });
    }
  }

  const q = search.toLowerCase();
  const filteredExt = extEvents.filter(e =>
    !q || (e.title || "").toLowerCase().includes(q) || (e.location || "").toLowerCase().includes(q)
  );
  const filteredInt = intEvents.filter(e =>
    !q || (e.title || "").toLowerCase().includes(q) || (e.location || "").toLowerCase().includes(q)
  );

  const selectedIsInternal = selectedEvent?.visibility === "internal";
  const selectedIsRegistered = selectedEvent ? registrations.has(selectedEvent.id) : false;
  const selectedRegistering = selectedEvent ? registering.has(selectedEvent.id) : false;

  return (
    <div>
      {/* Header */}
      <div className="hero-gradient wave-bottom relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />
        <div className="absolute pointer-events-none" style={{
          top: "-80px", right: "-80px", width: "380px", height: "380px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(198,255,0,0.18) 0%, transparent 65%)",
        }} />
        <div className="absolute pointer-events-none" style={{
          bottom: "-60px", left: "-60px", width: "260px", height: "260px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(123,77,255,0.22) 0%, transparent 65%)",
        }} />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: "#C6FF00" }}>
              Komprestasi IPB
            </span>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/15 shadow-xl shadow-black/10 flex-shrink-0">
                <CalendarDays size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white tracking-tight">Event</h1>
                <p className="text-xs text-white/40 font-medium mt-1">Event dari {siteConfig.name}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 -mt-4 relative z-10 pb-16">
        <div className="relative mb-8">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari event..."
            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white border border-zinc-200 shadow-lg text-sm placeholder:text-zinc-300 focus:outline-none focus:border-royal-500 focus:ring-2 focus:ring-royal-100 transition-all"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 rounded-full border-2 border-royal-200 border-t-royal-600 animate-spin" />
          </div>
        ) : (
          <div className="space-y-10">
            {/* External events */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Terbuka untuk umum</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{filteredExt.length}</span>
              </div>
              {filteredExt.length === 0 ? (
                <div className="relative flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-zinc-100 overflow-hidden">
                  <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, #4A1FB5 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                  <div className="relative w-16 h-16 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                    <CalendarDays size={26} className="text-emerald-300" />
                  </div>
                  <p className="relative text-sm font-black text-zinc-400">Belum ada event eksternal</p>
                  <p className="relative text-[11px] text-zinc-300 mt-1">Event terbuka untuk umum akan muncul di sini</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredExt.map(ev => (
                    <EventCard
                      key={ev.id}
                      event={ev}
                      isInternal={false}
                      isRegistered={false}
                      registering={false}
                      onRegister={() => {}}
                      user={user}
                      onOpen={() => setSelectedEvent(ev)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Internal events — only for logged-in users */}
            {user && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-black text-royal-600 uppercase tracking-widest">Khusus anggota</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-royal-100 text-royal-700">{filteredInt.length}</span>
                </div>
                {filteredInt.length === 0 ? (
                  <div className="relative flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-zinc-100 overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, #4A1FB5 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                    <div className="relative w-16 h-16 rounded-xl bg-royal-50 flex items-center justify-center mb-3">
                      <CalendarDays size={26} className="text-royal-300" />
                    </div>
                    <p className="relative text-sm font-black text-zinc-400">Belum ada event internal</p>
                    <p className="relative text-[11px] text-zinc-300 mt-1">Event khusus anggota akan muncul di sini</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredInt.map(ev => (
                      <EventCard
                        key={ev.id}
                        event={ev}
                        isInternal={true}
                        isRegistered={registrations.has(ev.id)}
                        registering={registering.has(ev.id)}
                        onRegister={handleRegister}
                        user={user}
                        onOpen={() => setSelectedEvent(ev)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Not logged in hint */}
            {!user && (
              <div className="p-4 rounded-xl bg-royal-50 border border-royal-100 flex items-center gap-2.5">
                <Lock size={14} className="text-royal-400 flex-shrink-0" />
                <p className="text-xs text-royal-700">
                  <strong>Login</strong> untuk melihat dan mendaftar event internal khusus anggota.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          isInternal={selectedIsInternal}
          isRegistered={selectedIsRegistered || (selectedEvent._justRegistered ?? false)}
          onRegister={handleRegister}
          registering={selectedRegistering}
          user={user}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
