import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function ReportBugPage() {
  const { user } = useAuth();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (user) fetchHistory();
  }, [user?.id]);

  async function fetchHistory() {
    const { data } = await supabase
      .from("pesen_desain")
      .select("*")
      .eq("requested_by", user.id)
      .eq("from_divisi", "bug_report")
      .order("created_at", { ascending: false });
    setHistory(data || []);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!description.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("pesen_desain").insert({
        title: "[BUG] Bug Report",
        notes: description.trim(),
        status: "Pending",
        from_divisi: "bug_report",
        requested_by: user?.id ?? null,
      });
      if (error) throw error;
      setDescription("");
      setSuccess(true);
      fetchHistory();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-md shadow-red-500/30">
          <AlertTriangle size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-black text-zinc-900">Report Bug</h1>
          <p className="text-[11px] text-zinc-400">Laporkan bug atau masalah ke tim MBD</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-zinc-100 p-5 mb-6">
        <label className="block text-xs font-bold text-zinc-700 mb-2">
          Jelaskan bug yang kamu temukan
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          placeholder="Contoh: Tombol upload tidak berfungsi saat..."
          className="w-full text-sm text-zinc-900 placeholder:text-zinc-300 bg-zinc-50 rounded-lg px-3 py-2.5 border border-zinc-100 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition resize-none mb-3"
        />
        {success && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100 mb-3">
            <CheckCircle size={14} className="text-emerald-500" />
            <p className="text-xs font-semibold text-emerald-700">Laporan terkirim!</p>
          </div>
        )}
        <button
          type="submit"
          disabled={loading || !description.trim()}
          className="w-full py-2.5 rounded-xl bg-red-600 text-white text-sm font-black hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Mengirim..." : "Kirim Laporan"}
        </button>
      </form>

      {history.length > 0 && (
        <div>
          <h2 className="text-xs font-black text-zinc-500 uppercase tracking-wider mb-3">Laporan Sebelumnya</h2>
          <div className="space-y-3">
            {history.map(item => (
              <div key={item.id} className="bg-white rounded-xl border border-zinc-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-600 leading-relaxed line-clamp-3">{item.notes}</p>
                    <p className="text-[10px] text-zinc-400 mt-2">{formatDate(item.created_at)}</p>
                    {item.status === "Done" && (
                      <p className="text-[11px] text-emerald-600 font-medium mt-1">Bug sudah di-solve oleh MBD</p>
                    )}
                  </div>
                  <span className={`flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full ${item.status === "Done" ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-600"}`}>
                    {item.status === "Done" ? "Solved" : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
