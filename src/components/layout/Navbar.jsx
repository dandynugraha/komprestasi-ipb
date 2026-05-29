import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, ArrowRight } from "lucide-react";
import siteConfig from "@/config/site.config";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = location.pathname === "/";
  const onDark = (isHome || ["/lomba", "/event", "/fasilitas", "/about", "/faq"].includes(location.pathname)) && !scrolled;

  const isActive = (p) => p === "/" ? location.pathname === "/" : location.pathname.startsWith(p);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled
        ? "bg-white/97 backdrop-blur-md border-b border-zinc-200/80 shadow-lg shadow-zinc-200/50"
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={siteConfig.logos.navbar}
              alt={siteConfig.shortName}
              className={`h-8 w-auto transition-all duration-200 group-hover:scale-105 ${onDark ? "brightness-0 invert" : ""}`}
              onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }}
            />
            <span className={`font-black text-base tracking-tight transition-colors duration-200 ${onDark ? "text-white" : "text-royal-700"}`} style={{ display: "none" }}>
              {siteConfig.shortName}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {siteConfig.publicNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 text-[13px] font-semibold transition-all duration-200 rounded-lg ${
                  isActive(item.path)
                    ? onDark
                      ? "text-white bg-white/20 font-bold"
                      : "text-royal-700 bg-royal-100 font-bold"
                    : onDark
                      ? "text-white/70 hover:text-white hover:bg-white/10"
                      : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100"
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: onDark ? "#C6FF00" : "#4A1FB5" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={user ? "/dashboard" : "/login"}
              className={`hidden md:flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-bold transition-all duration-200 hover:-translate-y-0.5 ${
                onDark
                  ? "bg-white text-royal-700 hover:bg-zinc-50 shadow-lg shadow-black/10"
                  : "bg-royal-600 text-white hover:bg-royal-700 shadow-md shadow-royal-600/25 hover:shadow-lg hover:shadow-royal-600/30"
              }`}
            >
              {user ? (
                <>Dashboard <ArrowRight size={14} /></>
              ) : (
                <><LogIn size={14} /> Login</>
              )}
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                onDark ? "text-white hover:bg-white/10" : "text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-zinc-200 shadow-xl"
          >
            <div className="p-4 space-y-1">
              {siteConfig.publicNav.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-bold transition-colors ${
                    isActive(item.path)
                      ? "text-royal-700 bg-royal-50 border-l-2 border-royal-500"
                      : "text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-zinc-100">
                <Link
                  to={user ? "/dashboard" : "/login"}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg bg-royal-600 text-white text-sm font-bold text-center hover:bg-royal-700 transition-colors"
                >
                  {user ? "Dashboard" : "Login"}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
