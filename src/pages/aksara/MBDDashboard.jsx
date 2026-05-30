import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Palette, Clock, Play, RotateCcw, CheckCircle, ChevronDown, X, AlertTriangle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const columns = [
  { id: "Pending",     icon: Clock,        gradient: "from-zinc-400 to-zinc-500",       shadow: "rgba(113,113,122,0.25)" },
  { id: "In Progress", icon: Play,         gradient: "from-blue-400 to-blue-500",       shadow: "rgba(59,130,246,0.28)"  },
  { id: "Revision",   icon: RotateCcw,    gradient: "from-amber-400 to-amber-500",     shadow: "rgba(245,158,11,0.28)"  },
  { id: "Done",        icon: CheckCircle,  gradient: "from-emerald-400 to-emerald-500", shadow: "rgba(52,211,153,0.28)"  },
];

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function parseDriveLink(notes) {
  if (!notes) return null;
  const match = notes.match(/\[DRIVE_LINK:(https?:\/\/[^\]]+)\]/);
  return match ? match[1] : null;
}

function cleanNotes(notes) {
  return (notes || "").replace(/\n?\[DRIVE_LINK:[^\]]*\]/g, "").trim();
}

function DesainModal({ item, initialStatus, onClose, onSaved }) {
  const [status, setStatus] = useState(initialStatus || item.status);
  const [driveLink, setDriveLink] = useState("");
  const [saving, setSaving] = useState(false);

  const existingDriveLink = parseDriveLink(item.notes);
  const displayNotes = cleanNotes(item.notes);
  const needsDriveLink = status === "Done" && !existingDriveLink;
  const hasChange = status !== item.status;

  async function handleSave() {
    if (!hasChange && !needsDriveLink) { onClose(); return; }
    if (needsDriveLink && !driveLink.trim()) return;

    setSaving(true);
    try {
      if (needsDriveLink && driveLink.trim()) {
        const updatedNotes = (item.notes || "") + `\n[DRIVE_LINK:${driveLink.trim()}]`;
        await supabase.from("pesen_desain").update({ status, notes: updatedNotes }).eq("id", item.id);
      } else {
        await supabase.from("pesen_desain").update({ status }).eq("id", item.id);
      }
      onSaved();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

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
        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h2 className="text-base font-black text-zinc-900 leading-snug">{item.title}</h2>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 hover:bg-zinc-200 transition-colors"
            >
              <X size={14} className="text-zinc-500" />
            </button>
          </div>
          <p className="text-xs text-zinc-400 mb-0.5">
            Dari: <span className="font-medium text-zinc-600">{item.requester_name}</span>
            {item.from_divisi && <span className="text-zinc-400"> — {item.from_divisi}</span>}
          </p>
          <p className="text-xs text-zinc-400 mb-4">{formatDate(item.created_at)}</p>

          {displayNotes && (
            <div className="bg-zinc-50 rounded-lg p-4 mb-4">
              <p className="text-xs text-zinc-600 whitespace-pre-wrap leading-relaxed">{displayNotes}</p>
            </div>
          )}

          {existingDriveLink && (
            <a
              href={existingDriveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors mb-4"
            >
              Lihat Hasil Desain (Drive)
            </a>
          )}

          <div className="border-t border-zinc-100 pt-4">
            <label className="block text-xs font-bold text-zinc-500 mb-2">Ubah Status</label>
            <div className="relative mb-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-xs pl-3 pr-8 py-2 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none appearance-none"
              >
                {columns.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>

            {needsDriveLink && (
              <div className="mb-3">
                <label className="block text-xs font-bold text-zinc-500 mb-1.5">
                  Link Google Drive hasil desain <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  value={driveLink}
                  onChange={(e) => setDriveLink(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
                />
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving || (needsDriveLink && !driveLink.trim())}
              className="w-full py-2.5 rounded-lg bg-violet-600 text-white text-xs font-black hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Menyimpan..." : needsDriveLink ? "Selesai & Kirim Link" : "Simpan Status"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function MBDDashboard() {
  const [items, setItems] = useState([]);
  const [bugReports, setBugReports] = useState([]);
  const [activeTab, setActiveTab] = useState("desain");
  const [selectedDesain, setSelectedDesain] = useState(null);
  const [initialModalStatus, setInitialModalStatus] = useState(null);

  useEffect(() => {
    fetchItems();
    fetchBugReports();
  }, []);

  useEffect(() => {
    if (!selectedDesain) return;
    window.history.pushState({ modal: true }, '');
    const onPopState = () => setSelectedDesain(null);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [selectedDesain]);

  async function fetchItems() {
    const { data: designs } = await supabase
      .from("pesen_desain")
      .select("*")
      .neq("from_divisi", "bug_report")
      .order("created_at", { ascending: false });

    if (!designs || designs.length === 0) { setItems([]); return; }

    const userIds = [...new Set(designs.map(d => d.requested_by).filter(Boolean))];
    let userMap = {};
    if (userIds.length > 0) {
      const { data: users } = await supabase.from("users").select("id, name").in("id", userIds);
      (users || []).forEach(u => { userMap[u.id] = u.name; });
    }

    setItems(designs.map(d => ({ ...d, requester_name: userMap[d.requested_by] || "Unknown" })));
  }

  async function fetchBugReports() {
    const { data: bugs } = await supabase
      .from("pesen_desain")
      .select("*")
      .eq("from_divisi", "bug_report")
      .order("created_at", { ascending: false });

    if (!bugs || bugs.length === 0) { setBugReports([]); return; }

    const userIds = [...new Set(bugs.map(b => b.requested_by).filter(Boolean))];
    let userMap = {};
    if (userIds.length > 0) {
      const { data: users } = await supabase.from("users").select("id, name").in("id", userIds);
      (users || []).forEach(u => { userMap[u.id] = u.name; });
    }

    setBugReports(bugs.map(b => ({ ...b, reporter_name: userMap[b.requested_by] || "Unknown" })));
  }

  async function updateStatus(id, newStatus) {
    await supabase.from("pesen_desain").update({ status: newStatus }).eq("id", id);
    fetchItems();
  }

  async function updateBugStatus(id, newStatus) {
    await supabase.from("pesen_desain").update({ status: newStatus }).eq("id", id);
    fetchBugReports();
  }

  function openCard(item) {
    setInitialModalStatus(null);
    setSelectedDesain(item);
  }

  function openCardForDone(item) {
    setInitialModalStatus("Done");
    setSelectedDesain(item);
  }

  const pendingBugs = bugReports.filter(b => b.status !== "Done").length;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-500/30">
          <Palette size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-black text-zinc-900">MBD Dashboard</h1>
          <p className="text-[11px] text-zinc-400">Kanban — permintaan desain dari CDA, HEG, Korvoks</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {columns.map((col) => {
          const count = items.filter(i => i.status === col.id).length;
          return (
            <div key={col.id} className="bg-gradient-to-br from-white to-zinc-50 rounded-xl border border-zinc-100 p-4 text-center shadow-sm card-hover">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${col.gradient} flex items-center justify-center mx-auto mb-2.5`} style={{ boxShadow: `0 4px 12px ${col.shadow}` }}>
                <col.icon size={15} className="text-white" />
              </div>
              <p className="text-xl font-black text-zinc-900">{count}</p>
              <p className="text-[9px] text-zinc-400 font-medium">{col.id}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setActiveTab("desain")}
          className={`px-4 py-2 rounded-full text-xs font-black transition-all ${activeTab === "desain" ? "text-white shadow-md" : "bg-white text-zinc-500 border border-zinc-200 hover:bg-zinc-50"}`}
          style={activeTab === "desain" ? { background: "linear-gradient(135deg, #7C3AED, #6D28D9)" } : {}}
        >
          Pesen Desain
        </button>
        <button
          onClick={() => setActiveTab("bugs")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black transition-all ${activeTab === "bugs" ? "text-white shadow-md" : "bg-white text-zinc-500 border border-zinc-200 hover:bg-zinc-50"}`}
          style={activeTab === "bugs" ? { background: "linear-gradient(135deg, #DC2626, #B91C1C)" } : {}}
        >
          Bug Reports
          {pendingBugs > 0 && (
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${activeTab === "bugs" ? "bg-white/20 text-white" : "bg-red-100 text-red-600"}`}>
              {pendingBugs}
            </span>
          )}
        </button>
      </div>

      {/* Desain Kanban */}
      {activeTab === "desain" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {columns.map((col) => {
            const colItems = items.filter(i => i.status === col.id);
            return (
              <div key={col.id}>
                <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl mb-3 bg-gradient-to-r ${col.gradient} shadow-sm`}>
                  <col.icon size={13} className="text-white" />
                  <span className="text-xs font-black text-white">{col.id}</span>
                  <span className="ml-auto text-[10px] font-black text-white/70 bg-white/20 px-2 py-0.5 rounded-full">{colItems.length}</span>
                </div>
                {colItems.length === 0 ? (
                  <div className="py-10 text-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50">
                    <p className="text-[10px] font-bold text-zinc-300">Kosong</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {colItems.map(item => (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl border border-zinc-200 p-4 cursor-pointer hover:border-violet-200 hover:shadow-sm transition-all"
                        onClick={() => openCard(item)}
                      >
                        <p className="text-xs font-bold text-zinc-900 leading-snug">{item.title}</p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{item.requester_name}</p>
                        {item.from_divisi && <p className="text-[10px] text-zinc-300">{item.from_divisi}</p>}
                        {cleanNotes(item.notes) && (
                          <p className="text-[10px] text-zinc-300 mt-1.5 line-clamp-2">{cleanNotes(item.notes)}</p>
                        )}
                        <p className="text-[10px] text-zinc-300 mt-1">{formatDate(item.created_at)}</p>
                        <div className="mt-2 relative" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={item.status}
                            onChange={(e) => {
                              if (e.target.value === "Done" && item.status !== "Done") {
                                openCardForDone(item);
                                return;
                              }
                              updateStatus(item.id, e.target.value);
                            }}
                            className="text-[10px] w-full pl-2 pr-6 py-1 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none appearance-none"
                          >
                            {columns.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
                          </select>
                          <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bug Reports */}
      {activeTab === "bugs" && (
        <div>
          {bugReports.length === 0 ? (
            <div className="relative flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-zinc-100 overflow-hidden">
              <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, #DC2626 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <div className="relative w-16 h-16 rounded-xl bg-red-50 flex items-center justify-center mb-3">
                <AlertTriangle size={24} className="text-red-200" />
              </div>
              <p className="relative text-sm font-black text-zinc-300">Belum ada bug report</p>
              <p className="relative text-[11px] text-zinc-300 mt-1">Bug dari pengguna akan muncul di sini</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bugReports.map(bug => (
                <div key={bug.id} className="bg-white rounded-xl border border-zinc-200 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-zinc-900 text-sm">{bug.reporter_name}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">{formatDate(bug.created_at)}</p>
                      {bug.notes && (
                        <p className="text-xs text-zinc-600 mt-2 whitespace-pre-wrap leading-relaxed">{bug.notes}</p>
                      )}
                      {bug.status === "Done" && (
                        <p className="text-[11px] text-emerald-600 font-medium mt-2">Bug sudah di-solve oleh MBD</p>
                      )}
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${bug.status === "Done" ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-600"}`}>
                        {bug.status === "Done" ? "Solved" : "Pending"}
                      </span>
                      {bug.status !== "Done" && (
                        <button
                          onClick={() => updateBugStatus(bug.id, "Done")}
                          className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                        >
                          Mark Solved
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedDesain && (
        <DesainModal
          item={selectedDesain}
          initialStatus={initialModalStatus}
          onClose={() => setSelectedDesain(null)}
          onSaved={() => { fetchItems(); setSelectedDesain(null); }}
        />
      )}
    </div>
  );
}
