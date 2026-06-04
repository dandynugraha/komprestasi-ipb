import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Plus, X, Calendar, TrendingUp, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import siteConfig from "@/config/site.config";

const fmt = (n) => new Intl.NumberFormat("id-ID").format(n || 0);

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function MyPengeluaranPage() {
  const { user } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(siteConfig.pengeluaranCategories[0]);

  useEffect(() => {
    if (user) fetchPengeluaran();
  }, [user?.id]);

  async function fetchPengeluaran() {
    const { data } = await supabase
      .from("pengeluaran")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });
    setItems(data || []);
  }

  async function handleSave() {
    if (!name.trim() || !amount) return;
    setSaving(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const { error } = await supabase.from("pengeluaran").insert({
        user_id: user.id,
        name: name.trim(),
        amount: parseInt(amount, 10),
        category,
        date: today,
      });
      if (error) throw error;
      setName("");
      setAmount("");
      setCategory(siteConfig.pengeluaranCategories[0]);
      setShowAdd(false);
      fetchPengeluaran();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    await supabase.from("pengeluaran").delete().eq("id", id);
    fetchPengeluaran();
  }

  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const todayStr = now.toISOString().split("T")[0];

  const totalMonth = items
    .filter(i => new Date(i.date) >= firstOfMonth)
    .reduce((sum, i) => sum + (i.amount || 0), 0);

  const totalToday = items
    .filter(i => i.date === todayStr)
    .reduce((sum, i) => sum + (i.amount || 0), 0);

  const daysElapsed = Math.max(1, now.getDate());
  const avgPerDay = Math.round(totalMonth / daysElapsed);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
            <Wallet size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-900">Pengeluaran Saya</h1>
            <p className="text-[11px] text-zinc-400">Catat pengeluaran harian kamu</p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all hover:shadow-lg hover:shadow-emerald-600/20"
        >
          <Plus size={14} />
          Tambah
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { label: "Total bulan ini", value: `Rp ${fmt(totalMonth)}`, gradient: "from-emerald-500 to-emerald-400", icon: Wallet },
          { label: "Total hari ini", value: `Rp ${fmt(totalToday)}`, gradient: "from-blue-500 to-blue-400", icon: Calendar },
          { label: "Rata-rata/hari", value: `Rp ${fmt(avgPerDay)}`, gradient: "from-amber-500 to-amber-400", icon: TrendingUp },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-zinc-100 p-4 card-hover">
            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-2`}>
              <s.icon size={12} className="text-white" />
            </div>
            <p className="text-sm font-bold text-zinc-900">{s.value}</p>
            <p className="text-[9px] text-zinc-400">{s.label}</p>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="p-5 bg-white rounded-2xl border border-zinc-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-zinc-900">Catat pengeluaran</h3>
                <button onClick={() => setShowAdd(false)} className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-400">
                  <X size={14} />
                </button>
              </div>
              <div className="space-y-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama pengeluaran"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs placeholder:text-zinc-300 focus:outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100/50 transition-all"
                />
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Jumlah (Rp)"
                  type="number"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs placeholder:text-zinc-300 focus:outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100/50 transition-all"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-500 focus:outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100/50 transition-all"
                >
                  {siteConfig.pengeluaranCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <button
                  onClick={handleSave}
                  disabled={saving || !name.trim() || !amount}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-zinc-100">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3">
            <Wallet size={24} className="text-emerald-200" />
          </div>
          <p className="text-sm font-semibold text-zinc-300">Belum ada pengeluaran</p>
          <p className="text-[11px] text-zinc-300 mt-1">Tekan "Tambah" untuk mulai mencatat</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-100 divide-y divide-zinc-100">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between px-5 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-zinc-900 truncate">{item.name}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{item.category} · {formatDate(item.date)}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                <p className="text-sm font-bold text-zinc-900">Rp {fmt(item.amount)}</p>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 text-zinc-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
