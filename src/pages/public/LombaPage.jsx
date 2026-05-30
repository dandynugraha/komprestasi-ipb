import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Search, ExternalLink, CalendarDays } from "lucide-react";
import { supabase } from "@/lib/supabase";

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function isDeadlinePast(dateStr) {
  return new Date(dateStr) < new Date(new Date().toDateString());
}

export default function LombaPage() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLombaInfo() {
      const { data } = await supabase
        .from("events")
        .select("id, title, date, description")
        .eq("visibility", "lomba_info")
        .order("date", { ascending: true });

      const parsed = (data || []).map(item => {
        let info = {};
        try { info = JSON.parse(item.description || "{}"); } catch {}
        return { ...item, ...info };
      });
      setItems(parsed);
      setLoading(false);
    }
    fetchLombaInfo();
  }, []);

  const filtered = items.filter(item =>
    !search ||
    (item.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.penyelenggara || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.bidang || "").toLowerCase().includes(search.toLowerCase())
  );

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
                <Trophy size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white tracking-tight">Info Lomba</h1>
                <p className="text-xs text-white/40 font-medium mt-1">Info lomba terbaru dari CDA</p>
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
            placeholder="Cari lomba..."
            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white border border-zinc-200 shadow-lg text-sm placeholder:text-zinc-300 focus:outline-none focus:border-royal-500 focus:ring-2 focus:ring-royal-100 transition-all"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-royal-300 border-t-royal-600 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="relative flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-zinc-100 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.025]" style={{
              backgroundImage: "radial-gradient(circle, #4A1FB5 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }} />
            <div className="relative w-20 h-20 rounded-xl bg-gradient-to-br from-amber-50 to-white flex items-center justify-center mb-4 shadow-sm border border-amber-100/60">
              <Trophy size={32} className="text-amber-300" />
            </div>
            <h2 className="relative text-base font-black text-zinc-400">Belum ada info lomba</h2>
            <p className="relative text-xs text-zinc-300 mt-1">Info lomba dari CDA akan muncul di sini</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(item => {
              const past = item.date && isDeadlinePast(item.date);
              return (
                <div key={item.id} className="bg-white rounded-xl border border-zinc-200 p-5 flex flex-col gap-3">
                  <div>
                    <p className="font-black text-zinc-900 text-sm leading-snug">{item.title}</p>
                    {item.penyelenggara && (
                      <p className="text-xs text-zinc-400 mt-1">oleh {item.penyelenggara}</p>
                    )}
                  </div>
                  {item.bidang && (
                    <span className="self-start text-[10px] font-bold px-2.5 py-1 rounded-full bg-royal-50 text-royal-600">
                      {item.bidang}
                    </span>
                  )}
                  {item.date && (
                    <div className="flex items-center gap-1.5 text-xs">
                      <CalendarDays size={12} className={past ? "text-red-400" : "text-zinc-400"} />
                      <span className={past ? "text-red-500 font-medium" : "text-zinc-500"}>
                        {past ? "Deadline lewat · " : "Deadline: "}{formatDate(item.date)}
                      </span>
                    </div>
                  )}
                  <div className="flex gap-2 mt-auto pt-1">
                    {item.link_info && (
                      <a
                        href={item.link_info}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-royal-600 text-white text-xs font-bold hover:bg-royal-700 transition-colors"
                      >
                        <ExternalLink size={11} /> Info Lebih Lanjut
                      </a>
                    )}
                    {item.link_daftar && (
                      <a
                        href={item.link_daftar}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                      >
                        <ExternalLink size={11} /> Gas Daftar
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
