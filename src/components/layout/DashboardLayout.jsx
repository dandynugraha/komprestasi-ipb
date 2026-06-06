import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Trophy, Calendar, Wallet, CalendarDays, Upload,
  Award, Activity, Folder, HelpCircle, Settings, LogOut,
  Database, Users, Palette, MapPin, Eye, Brush, Menu, X, AlertTriangle, BarChart3,
} from "lucide-react";
import siteConfig from "@/config/site.config";
import { useAuth } from "@/context/AuthContext";

const iconMap = {
  home: Home, trophy: Trophy, calendar: Calendar, wallet: Wallet,
  calendarDays: CalendarDays, upload: Upload, award: Award,
  activity: Activity, folder: Folder, help: HelpCircle,
  settings: Settings, database: Database, users: Users,
  palette: Palette, mapPin: MapPin, eye: Eye, brush: Brush,
  alertTriangle: AlertTriangle, barChart3: BarChart3,
};

function getNavItems(profile) {
  const items = [];

  // Supervisor — cek PALING AWAL, return langsung
  if (profile?.role === "supervisor") {
    items.push({ section: "Supervisor" });
    items.push({ icon: "barChart3", label: "Dashboard Analytics", path: "/dashboard/supervisor" });
    items.push({ section: "Lainnya" });
    items.push({ icon: "help", label: "FAQ", path: "/dashboard/faq" });
    return items;
  }

  // Aksara Area — hanya divisi sendiri
  if (profile?.role === "aksara" || (profile?.role && profile.role.startsWith("cda")) || (profile?.role && profile.role.startsWith("mbd")) || profile?.role === "heg" || profile?.role === "korvoks" || profile?.role === "bph") {
    items.push({ section: "Aksara area" });
    const role = (profile.role || "").toLowerCase();

    // CDA variants: "cda", "cda (bisnis)", "cda (penulisan)", "cda (desain)", "cda (olimpiade)"
    if (role.startsWith("cda")) {
      items.push({ icon: "database", label: "CDA", path: "/dashboard/cda" });
    }
    if (role === "heg") {
      items.push({ icon: "users", label: "HEG", path: "/dashboard/heg" });
    }
    // MBD variants: "mbd", "mbd (ilustrator)", "mbd (desain grafis)", etc
    if (role.startsWith("mbd")) {
      items.push({ icon: "palette", label: "MBD", path: "/dashboard/mbd" });
    }
    if (role === "korvoks") {
      items.push({ icon: "mapPin", label: "Korvoks", path: "/dashboard/korvoks" });
    }
    if (role === "bph") {
      items.push({ icon: "eye", label: "BPH", path: "/dashboard/bph" });
    }
  }

  // Admin — semua
  if (profile?.role === "admin") {
    items.push({ section: "Aksara area" });
    items.push({ icon: "database", label: "CDA", path: "/dashboard/cda" });
    items.push({ icon: "users", label: "HEG", path: "/dashboard/heg" });
    items.push({ icon: "palette", label: "MBD", path: "/dashboard/mbd" });
    items.push({ icon: "mapPin", label: "Korvoks", path: "/dashboard/korvoks" });
    items.push({ icon: "eye", label: "BPH", path: "/dashboard/bph" });
    items.push({ icon: "settings", label: "Admin Panel", path: "/dashboard/admin" });
  }

  // Fitur saya — semua role
  items.push({ section: "Fitur saya" });
  items.push({ icon: "home", label: "Dashboard", path: "/dashboard" });
  items.push({ icon: "trophy", label: "Lomba Saya", path: "/dashboard/lomba" });
  items.push({ icon: "calendar", label: "Jadwal Saya", path: "/dashboard/jadwal" });
  items.push({ icon: "wallet", label: "Pengeluaran Saya", path: "/dashboard/pengeluaran" });
  items.push({ icon: "calendarDays", label: "Event Saya", path: "/dashboard/event" });

  // Pesen desain — CDA, HEG, Korvoks
  const roleL = (profile?.role || "").toLowerCase();
  if (roleL.startsWith("cda") || roleL === "heg" || roleL === "korvoks") {
    items.push({ icon: "brush", label: "Pesen Desain", path: "/dashboard/pesen-desain" });
  }

  // Upload
  items.push({ section: "Upload" });
  items.push({ icon: "award", label: "Upload Prestasi", path: "/dashboard/upload/prestasi" });
  items.push({ icon: "activity", label: "Upload Kegiatan", path: "/dashboard/upload/kegiatan" });
  items.push({ icon: "folder", label: "Upload Project", path: "/dashboard/upload/project" });
  items.push({ icon: "upload", label: "Upload Saya", path: "/dashboard/my-uploads" });

  // Lainnya
  items.push({ section: "Lainnya" });
  items.push({ icon: "alertTriangle", label: "Report Bug", path: "/dashboard/report-bug" });
  items.push({ icon: "help", label: "FAQ", path: "/faq" });
  items.push({ icon: "settings", label: "Settings", path: "/dashboard/settings" });

  return items;
}

// Bottom nav items for mobile
const bottomNavItems = [
  { icon: "home", label: "Home", path: "/dashboard" },
  { icon: "upload", label: "Upload", path: "/dashboard/upload/prestasi" },
  { icon: "trophy", label: "Lomba", path: "/dashboard/lomba" },
  { icon: "calendar", label: "Jadwal", path: "/dashboard/jadwal" },
  { icon: "wallet", label: "Uang", path: "/dashboard/pengeluaran" },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const navItems = getNavItems(profile);
  const isActive = (path) =>
    path === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname.startsWith(path);

  const initials =
    profile?.name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  const roleLabel = [
    profile?.role && profile.role.charAt(0).toUpperCase() + profile.role.slice(1),
    profile?.divisi && `${profile.divisi.toUpperCase()}`,
    profile?.cluster,
    profile?.lokasi,
  ]
    .filter(Boolean)
    .join(" · ");

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-52 bg-white border-r border-zinc-100 flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="px-4 py-4 flex items-center gap-2">
          <img
            src={siteConfig.logos.navbar}
            alt=""
            className="h-7 w-auto"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-2 pb-2">
          {navItems.map((item, i) =>
            item.section ? (
              <p
                key={`sec-${i}`}
                className="px-3 pt-4 pb-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider"
              >
                {item.section}
              </p>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors mb-0.5 ${
                  isActive(item.path)
                    ? "bg-royal-50 text-royal-600 font-semibold"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                {(() => {
                  const Icon = iconMap[item.icon];
                  return Icon ? <Icon size={15} /> : null;
                })()}
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* User profile */}
        <div className="border-t border-zinc-100 px-3 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-royal-100 flex items-center justify-center text-royal-700 text-xs font-bold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-900 truncate">
                {profile?.name || "Loading..."}
              </p>
              <p className="text-[10px] text-zinc-400 truncate">{roleLabel}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-zinc-100">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-zinc-50 text-zinc-600"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-zinc-900">
            {siteConfig.shortName}
          </span>
          <div className="w-7 h-7 rounded-full bg-royal-100 flex items-center justify-center text-royal-700 text-[10px] font-bold">
            {initials}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 flex justify-around py-1.5 z-30">
          {bottomNavItems.map((item) => {
            const Icon = iconMap[item.icon];
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 ${
                  active ? "text-royal-600" : "text-zinc-400"
                }`}
              >
                {Icon && <Icon size={18} />}
                <span className="text-[9px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
