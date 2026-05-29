import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Plus, Search, X, Clock, Play, RotateCcw, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const statusIcons = {
  Pending: { icon: Clock, color: "text-zinc-400", bg: "bg-zinc-100" },
  "In Progress": { icon: Play, color: "text-blue-600", bg: "bg-blue-50" },
  Revision: { icon: RotateCcw, color: "text-amber-600", bg: "bg-amber-50" },
  Done: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
};

const inputClass = "w-full px-4 py-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs placeholder:text-zinc-300 focus:outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100/50 transition-all";
const labelClass = "block text-[11px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wide";

export default function PesenDesainPage() {
  const { user, profile } = useAuth();
  const [showAdd, setShowAdd] = useState(false);

  const [judul, setJudul] = useState("");
  const [ilustrasi, setIlustrasi] = useState("");
  const [desainGrafis, setDesainGrafis] = useState("");
  const [linkKonten, setLinkKonten] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!judul.trim()) { setError("Judul tidak boleh kosong."); return; }
    setError(null);
    setLoading(true);

    const notes = `Ilustrasi: ${ilustrasi.trim() || "-"}\nDesain Grafis: ${desainGrafis.trim() || "-"}\nLink: ${linkKonten.trim() || "-"}\nKeterangan: ${keterangan.trim() || "-"}`;

    const { error: insertError } = await supabase.from("pesen_desain").insert({
      title: judul.trim(),
      notes,
      status: "Pending",
      requested_by: user?.id ?? null,
      from_divisi: profile?.role ?? null,
    });

    setLoading(false);
    if (insertError) { setError(insertError.message); return; }

    setJudul("");
    setIlustrasi("");
    setDesainGrafis("");
    setLinkKonten("");
    setKeterangan("");
    setShowAdd(false);
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Palette size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-900">Pesen Desain</h1>
            <p className="text-[11px] text-zinc-400">Request desain ke tim MBD</p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-all hover:shadow-lg hover:shadow-violet-600/20"
        >
          <Plus size={14} />
          Request Baru
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="p-5 bg-white rounded-2xl border border-zinc-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-zinc-900">Request desain baru</h3>
                <button type="button" onClick={() => setShowAdd(false)} className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-400">
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-3">
                {/* 1. Judul */}
                <div>
                  <label className={labelClass}>Judul</label>
                  <input
                    type="text"
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    placeholder="Judul request"
                    className={inputClass}
                  />
                </div>

                {/* 2. Ilustrasi */}
                <div>
                  <label className={labelClass}>Ilustrasi</label>
                  <textarea
                    value={ilustrasi}
                    onChange={(e) => setIlustrasi(e.target.value)}
                    placeholder="Jelaskan ilustrasi yang kamu mau (gaya, warna, objek, mood, dll)"
                    rows={3}
                    className={inputClass + " resize-none"}
                  />
                </div>

                {/* 3. Desain Grafis */}
                <div>
                  <label className={labelClass}>Desain Grafis</label>
                  <textarea
                    value={desainGrafis}
                    onChange={(e) => setDesainGrafis(e.target.value)}
                    placeholder="Jelaskan desain grafis yang kamu mau (layout, ukuran, format, dll)"
                    rows={3}
                    className={inputClass + " resize-none"}
                  />
                </div>

                {/* 4. Link Konten */}
                <div>
                  <label className={labelClass}>Link Konten</label>
                  <input
                    type="text"
                    value={linkKonten}
                    onChange={(e) => setLinkKonten(e.target.value)}
                    placeholder="Link referensi / konten yang mau didesain (opsional)"
                    className={inputClass}
                  />
                </div>

                {/* 5. Keterangan Tambahan */}
                <div>
                  <label className={labelClass}>Keterangan Tambahan</label>
                  <textarea
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    placeholder="Info tambahan: deadline, referensi visual, catatan khusus, dll"
                    rows={3}
                    className={inputClass + " resize-none"}
                  />
                </div>

                {error && (
                  <p className="text-[11px] font-semibold text-red-500">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? "Mengirim..." : "Kirim Request"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-zinc-100">
        <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-3">
          <Palette size={24} className="text-violet-200" />
        </div>
        <p className="text-sm font-semibold text-zinc-300">Belum ada request</p>
        <p className="text-[11px] text-zinc-300 mt-1">Tekan "Request Baru" untuk memesan desain ke MBD</p>
      </div>
    </div>
  );
}
