import { useState, useEffect } from "react";
import { Palette, Clock, Play, RotateCcw, CheckCircle, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";

const columns = [
  { id: "Pending",      icon: Clock,       gradient: "from-zinc-400 to-zinc-500",    shadow: "rgba(113,113,122,0.25)" },
  { id: "In Progress",  icon: Play,        gradient: "from-blue-400 to-blue-500",    shadow: "rgba(59,130,246,0.28)"  },
  { id: "Revision",    icon: RotateCcw,   gradient: "from-amber-400 to-amber-500",  shadow: "rgba(245,158,11,0.28)"  },
  { id: "Done",         icon: CheckCircle, gradient: "from-emerald-400 to-emerald-500", shadow: "rgba(52,211,153,0.28)" },
];

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function MBDDashboard() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data: designs } = await supabase
      .from("pesen_desain")
      .select("*")
      .order("created_at", { ascending: false });

    if (!designs || designs.length === 0) { setItems([]); return; }

    const userIds = [...new Set(designs.map(d => d.requested_by).filter(Boolean))];
    let userMap = {};
    if (userIds.length > 0) {
      const { data: users } = await supabase
        .from("users")
        .select("id, name")
        .in("id", userIds);
      (users || []).forEach(u => { userMap[u.id] = u.name; });
    }

    setItems(designs.map(d => ({
      ...d,
      requester_name: userMap[d.requested_by] || "Unknown",
    })));
  }

  async function updateStatus(id, newStatus) {
    await supabase.from("pesen_desain").update({ status: newStatus }).eq("id", id);
    fetchItems();
  }

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
                    <div key={item.id} className="bg-white rounded-xl border border-zinc-200 p-4">
                      <p className="text-xs font-bold text-zinc-900 leading-snug">{item.title}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">{item.requester_name}</p>
                      {item.from_divisi && <p className="text-[10px] text-zinc-300">{item.from_divisi}</p>}
                      {item.notes && (
                        <p className="text-[10px] text-zinc-300 mt-1.5 line-clamp-2">{item.notes}</p>
                      )}
                      <p className="text-[10px] text-zinc-300 mt-1">{formatDate(item.created_at)}</p>
                      <div className="mt-2 relative">
                        <select
                          value={item.status}
                          onChange={(e) => updateStatus(item.id, e.target.value)}
                          className="text-[10px] w-full pl-2 pr-6 py-1 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none appearance-none"
                        >
                          {columns.map(c => (
                            <option key={c.id} value={c.id}>{c.id}</option>
                          ))}
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
    </div>
  );
}
