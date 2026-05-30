import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Plus, Search, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const lombaStatuses = ["Peserta", "Semifinalis", "Finalis"];

const CLUSTER_OPTIONS = [
  "Penulisan Ilmiah dan Olimpiade Sains",
  "Bisnis dan Analisis Strategi",
  "Desain dan Visual Kreatif",
];

function formatDate(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function statusBadgeClass(s) {
  if (s === "Peserta") return "bg-zinc-100 text-zinc-600";
  if (s === "Semifinalis") return "bg-amber-100 text-amber-700";
  if (s === "Finalis") return "bg-emerald-100 text-emerald-700";
  return "bg-zinc-100 text-zinc-600";
}

export default function MyLombaPage() {
  const { user, profile } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [cabang, setCabang] = useState("");
  const [status, setStatus] = useState(lombaStatuses[0]);
  const [deadline, setDeadline] = useState("");
  const [cluster, setCluster] = useState("");

  useEffect(() => {
    if (profile?.cluster && !cluster) setCluster(profile.cluster);
  }, [profile?.cluster]);

  useEffect(() => {
    if (user) fetchLomba();
  }, [user?.id]);

  async function fetchLomba() {
    const { data } = await supabase
      .from("lomba")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setItems(data || []);
  }

  async function handleSave() {
    if (!title.trim()) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("lomba").insert({
        user_id: user.id,
        title: title.trim(),
        cabang: cabang.trim(),
        status,
        deadline: deadline || null,
        cluster: cluster || profile?.cluster || null,
        lokasi: profile?.lokasi || null,
      });
      if (error) throw error;
      setTitle("");
      setCabang("");
      setStatus(lombaStatuses[0]);
      setDeadline("");
      setShowAdd(false);
      fetchLomba();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusUpdate(id, newStatus) {
    await supabase.from("lomba").update({ status: newStatus }).eq("id", id);
    fetchLomba();
  }

  const filtered = items.filter(i =>
    !search ||
    (i.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (i.cabang || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-royal-500 to-royal-600 flex items-center justify-center">
            <Trophy size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-900">My Lomba</h1>
            <p className="text-[11px] text-zinc-400">Tracking status lomba kamu</p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-royal-600 text-white text-xs font-semibold hover:bg-royal-700 transition-all hover:shadow-lg hover:shadow-royal-600/20"
        >
          <Plus size={14} />
          Tambah Lomba
        </button>
      </div>

      {showAdd && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-6 p-5 bg-white rounded-2xl border border-zinc-100 overflow-hidden"
        >
          <h3 className="text-xs font-bold text-zinc-900 mb-4">Tambah lomba baru</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nama lomba"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs placeholder:text-zinc-300 focus:outline-none focus:border-royal-300 focus:ring-4 focus:ring-royal-100/50 transition-all"
            />
            <input
              value={cabang}
              onChange={(e) => setCabang(e.target.value)}
              placeholder="Cabang"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs placeholder:text-zinc-300 focus:outline-none focus:border-royal-300 focus:ring-4 focus:ring-royal-100/50 transition-all"
            />
            <div className="relative">
              <select
                value={cluster}
                onChange={(e) => setCluster(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 focus:outline-none focus:border-royal-300 focus:ring-4 focus:ring-royal-100/50 transition-all appearance-none"
              >
                <option value="">Pilih cluster...</option>
                {CLUSTER_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 focus:outline-none focus:border-royal-300 focus:ring-4 focus:ring-royal-100/50 transition-all appearance-none"
              >
                {lombaStatuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-500 focus:outline-none focus:border-royal-300 focus:ring-4 focus:ring-royal-100/50 transition-all"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={saving || !title.trim()}
              className="px-4 py-2 rounded-xl bg-royal-600 text-white text-xs font-semibold hover:bg-royal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-600 text-xs font-semibold hover:bg-zinc-200 transition-all"
            >
              Batal
            </button>
          </div>
        </motion.div>
      )}

      <div className="relative mb-5">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari lomba..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs placeholder:text-zinc-300 focus:outline-none focus:border-royal-300 focus:ring-4 focus:ring-royal-100/50 transition-all"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-zinc-100">
          <div className="w-16 h-16 rounded-2xl bg-royal-50 flex items-center justify-center mb-3">
            <Trophy size={24} className="text-royal-200" />
          </div>
          <p className="text-sm font-semibold text-zinc-300">Belum ada lomba</p>
          <p className="text-[11px] text-zinc-300 mt-1">Tekan "Tambah Lomba" untuk mulai tracking</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-zinc-200 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-zinc-900 text-sm truncate">{item.title}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{item.cabang || "—"}</p>
                  {item.deadline && (
                    <p className="text-[11px] text-zinc-300 mt-1">Deadline: {formatDate(item.deadline)}</p>
                  )}
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${statusBadgeClass(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] text-zinc-400">Update status:</span>
                <div className="relative">
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                    className="text-[10px] pl-2 pr-5 py-1 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none appearance-none"
                  >
                    {lombaStatuses.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-4 rounded-2xl bg-royal-50 border border-royal-100">
        <p className="text-[11px] text-royal-700">
          Status lomba kamu (Peserta → Semifinalis → Finalis) dicatat di My Lomba. Kalau sudah dapat hasil, upload sebagai <strong>Prestasi</strong> di halaman Upload dengan status yang sesuai.
        </p>
      </div>
    </div>
  );
}
