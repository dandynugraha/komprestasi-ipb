import { useState, useEffect } from "react";
import { CalendarDays, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function MyEventPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (user) fetchEvents();
  }, [user?.id]);

  async function fetchEvents() {
    const { data: regs } = await supabase
      .from("event_registrations")
      .select("event_id")
      .eq("user_id", user.id);

    if (!regs || regs.length === 0) { setEvents([]); return; }

    const eventIds = regs.map(r => r.event_id).filter(Boolean);
    if (eventIds.length === 0) { setEvents([]); return; }

    const { data: evts } = await supabase
      .from("events")
      .select("*")
      .in("id", eventIds)
      .order("date", { ascending: true });

    setEvents(evts || []);
  }

  const filtered = events.filter(e =>
    !search || (e.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
          <CalendarDays size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-zinc-900">Event Saya</h1>
          <p className="text-[11px] text-zinc-400">Event yang kamu ikuti</p>
        </div>
      </div>

      <div className="relative mb-5">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari event..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs placeholder:text-zinc-300 focus:outline-none focus:border-royal-300 focus:ring-4 focus:ring-royal-100/50 transition-all"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-zinc-100">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3">
            <CalendarDays size={24} className="text-emerald-200" />
          </div>
          <p className="text-sm font-semibold text-zinc-300">Belum ada event</p>
          <p className="text-[11px] text-zinc-300 mt-1">Event yang kamu daftar akan muncul di sini</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-zinc-200 p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <CalendarDays size={18} className="text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-zinc-900 text-sm">{item.title}</p>
                  <p className="text-xs text-emerald-600 font-medium mt-0.5">{formatDate(item.date)}</p>
                  {item.location && <p className="text-xs text-zinc-400 mt-0.5">{item.location}</p>}
                  {item.time && <p className="text-xs text-zinc-400">{item.time}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
