import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, Trophy, Activity, Folder, Users, TrendingUp,
  Award, Star, ChevronDown, ChevronUp,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
};

function fmt(n) {
  return new Intl.NumberFormat("id-ID").format(n || 0);
}

function StatCard({ icon: Icon, label, value, color, index }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className="bg-white rounded-xl border border-zinc-100 p-5 flex items-center gap-4"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-[11px] text-zinc-400 font-medium">{label}</p>
        <p className="text-2xl font-black text-zinc-900">{fmt(value)}</p>
      </div>
    </motion.div>
  );
}

const CLUSTERS = [
  "Semua",
  "Penulisan Ilmiah dan Olimpiade Sains",
  "Bisnis dan Analisis Strategi",
  "Desain dan Visual Kreatif",
];

const MONTH_NAMES = [
  "Jan","Feb","Mar","Apr","Mei","Jun",
  "Jul","Agu","Sep","Okt","Nov","Des",
];

export default function SupervisorDashboard() {
  const { profile } = useAuth();

  const [stats, setStats] = useState({ prestasi: 0, kegiatan: 0, project: 0, members: 0 });
  const [leaderboard, setLeaderboard] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [cluster, setCluster] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    fetchAll();
  }, [cluster]);

  async function fetchAll() {
    setLoading(true);
    try {
      const clusterFilter = cluster === "Semua" ? null : cluster;

      const applyCluster = (q) =>
        clusterFilter ? q.eq("cluster", clusterFilter) : q;

      const [
        { count: prestasiCount },
        { count: kegiatanCount },
        { count: projectCount },
        { count: memberCount },
        { data: prestasiRows },
        { data: kegiatanRows },
        { data: projectRows },
        { data: usersData },
      ] = await Promise.all([
        applyCluster(supabase.from("prestasi").select("*", { count: "exact", head: true })),
        applyCluster(supabase.from("kegiatan").select("*", { count: "exact", head: true })),
        applyCluster(supabase.from("projects").select("*", { count: "exact", head: true })),
        applyCluster(supabase.from("users").select("*", { count: "exact", head: true }).neq("role", "supervisor")),
        applyCluster(supabase.from("prestasi").select("user_id, created_at")),
        applyCluster(supabase.from("kegiatan").select("user_id, created_at")),
        applyCluster(supabase.from("projects").select("user_id, created_at")),
        applyCluster(supabase.from("users").select("id, name, cluster")),
      ]);

      setStats({
        prestasi: prestasiCount || 0,
        kegiatan: kegiatanCount || 0,
        project: projectCount || 0,
        members: memberCount || 0,
      });

      // Leaderboard: count uploads per user
      const userMap = {};
      (usersData || []).forEach((u) => {
        userMap[u.id] = { name: u.name, cluster: u.cluster, count: 0 };
      });
      [...(prestasiRows || []), ...(kegiatanRows || []), ...(projectRows || [])].forEach((r) => {
        if (userMap[r.user_id]) userMap[r.user_id].count += 1;
      });
      const lb = Object.values(userMap)
        .filter((u) => u.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      setLeaderboard(lb);

      // Monthly chart: last 6 months
      const now = new Date();
      const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        return { year: d.getFullYear(), month: d.getMonth(), label: MONTH_NAMES[d.getMonth()] };
      });

      const allRows = [
        ...(prestasiRows || []).map((r) => ({ ...r, _type: "prestasi" })),
        ...(kegiatanRows || []).map((r) => ({ ...r, _type: "kegiatan" })),
        ...(projectRows || []).map((r) => ({ ...r, _type: "project" })),
      ];

      const monthly = months.map(({ year, month, label }) => {
        const count = allRows.filter((r) => {
          const d = new Date(r.created_at);
          return d.getFullYear() === year && d.getMonth() === month;
        }).length;
        return { label, count };
      });
      setMonthlyData(monthly);
    } catch (err) {
      console.error("SupervisorDashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  const maxMonthly = Math.max(...monthlyData.map((d) => d.count), 1);
  const sortedLeaderboard = [...leaderboard].sort((a, b) =>
    sortDir === "desc" ? b.count - a.count : a.count - b.count
  );

  return (
    <div className="p-5 sm:p-8">
      {/* Header */}
      <motion.div
        className="relative overflow-hidden rounded-xl p-6 sm:p-8 mb-8 hero-gradient"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={14} className="text-white/50" />
            <span className="text-[11px] text-white/50 font-bold uppercase tracking-wide">Supervisor Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Dashboard Analytics</h1>
          <p className="text-sm text-white/40 mt-1">Monitor aktivitas dan pencapaian anggota Komprestasi IPB</p>
        </div>
      </motion.div>

      {/* Cluster filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CLUSTERS.map((c) => (
          <button
            key={c}
            onClick={() => setCluster(c)}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${
              cluster === c
                ? "bg-royal-600 text-white"
                : "bg-white border border-zinc-200 text-zinc-500 hover:border-royal-300 hover:text-royal-600"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      >
        <StatCard icon={Users}    label="Total Anggota"   value={stats.members}  color="bg-royal-500"   index={0} />
        <StatCard icon={Award}    label="Total Prestasi"  value={stats.prestasi} color="bg-amber-500"   index={1} />
        <StatCard icon={Activity} label="Total Kegiatan"  value={stats.kegiatan} color="bg-emerald-500" index={2} />
        <StatCard icon={Folder}   label="Total Project"   value={stats.project}  color="bg-blue-500"    index={3} />
      </motion.div>

      {/* Monthly chart */}
      <motion.div
        className="bg-white rounded-xl border border-zinc-100 p-5 mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={15} className="text-royal-500" />
          <h2 className="text-sm font-black text-zinc-900">Upload per Bulan (6 bulan terakhir)</h2>
        </div>
        {loading ? (
          <div className="h-32 flex items-center justify-center text-zinc-300 text-xs">Memuat...</div>
        ) : (
          <div className="flex items-end gap-2 h-32">
            {monthlyData.map((d, i) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-zinc-400 font-bold">{d.count}</span>
                <div
                  className="w-full rounded-t-md bg-royal-500 transition-all duration-500"
                  style={{ height: `${(d.count / maxMonthly) * 96}px`, minHeight: d.count > 0 ? "4px" : "0" }}
                />
                <span className="text-[9px] text-zinc-400">{d.label}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        className="bg-white rounded-xl border border-zinc-100 p-5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star size={15} className="text-amber-500" />
            <h2 className="text-sm font-black text-zinc-900">Leaderboard Upload</h2>
          </div>
          <button
            onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-700 font-semibold"
          >
            {sortDir === "desc" ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
            {sortDir === "desc" ? "Terbanyak" : "Tersedikit"}
          </button>
        </div>
        {loading ? (
          <div className="text-center py-8 text-zinc-300 text-xs">Memuat...</div>
        ) : sortedLeaderboard.length === 0 ? (
          <div className="text-center py-8">
            <Trophy size={28} className="text-zinc-200 mx-auto mb-2" />
            <p className="text-xs text-zinc-400">Belum ada data upload</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedLeaderboard.map((u, i) => (
              <div key={u.name + i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-zinc-50">
                <span className={`text-xs font-black w-5 text-center ${i === 0 ? "text-amber-500" : i === 1 ? "text-zinc-400" : i === 2 ? "text-orange-400" : "text-zinc-300"}`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-zinc-900 truncate">{u.name}</p>
                  {u.cluster && <p className="text-[10px] text-zinc-400 truncate">{u.cluster}</p>}
                </div>
                <span className="text-xs font-black text-royal-600">{u.count} upload</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
