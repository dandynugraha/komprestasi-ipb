import { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import SplashScreen from "@/components/SplashScreen";
import PublicLayout from "@/components/layout/PublicLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Public pages
import HomePage from "@/pages/public/HomePage";
import LoginPage from "@/pages/public/LoginPage";
import AboutPage from "@/pages/public/AboutPage";
import FasilitasPage from "@/pages/public/FasilitasPage";
import LombaPage from "@/pages/public/LombaPage";
import EventPage from "@/pages/public/EventPage";
import FAQPage from "@/pages/public/FAQPage";

// Dashboard — Rona pages
import DashboardHome from "@/pages/rona/DashboardHome";
import UploadPage from "@/pages/rona/UploadPage";
import MyLombaPage from "@/pages/rona/MyLombaPage";
import MyJadwalPage from "@/pages/rona/MyJadwalPage";
import MyPengeluaranPage from "@/pages/rona/MyPengeluaranPage";
import MyEventPage from "@/pages/rona/MyEventPage";
import PesenDesainPage from "@/pages/rona/PesenDesainPage";

// Dashboard — Aksara pages
import CDADashboard from "@/pages/aksara/CDADashboard";
import HEGDashboard from "@/pages/aksara/HEGDashboard";
import MBDDashboard from "@/pages/aksara/MBDDashboard";
import KorvoksDashboard from "@/pages/aksara/KorvoksDashboard";
import BPHDashboard from "@/pages/aksara/BPHDashboard";
import CreateEventPage from "@/pages/aksara/CreateEventPage";

// Placeholder for pages still in development
function PlaceholderPage({ title }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center">
        <div className="w-14 h-14 rounded-xl bg-royal-50 flex items-center justify-center mx-auto mb-3">
          <span className="text-royal-300 text-lg font-black">?</span>
        </div>
        <h1 className="text-lg font-black text-zinc-900">{title}</h1>
        <p className="text-sm text-zinc-400 mt-1">Halaman ini sedang dalam pengembangan</p>
      </div>
    </div>
  );
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />;
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Login — standalone (no navbar/footer) */}
          <Route path="login" element={<LoginPage />} />

          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="lomba" element={<LombaPage />} />
            <Route path="event" element={<EventPage />} />
            <Route path="fasilitas" element={<FasilitasPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="prestasi/:id" element={<PlaceholderPage title="Detail Prestasi" />} />
          </Route>

          {/* Dashboard routes */}
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="lomba" element={<MyLombaPage />} />
            <Route path="jadwal" element={<MyJadwalPage />} />
            <Route path="pengeluaran" element={<MyPengeluaranPage />} />
            <Route path="event" element={<MyEventPage />} />
            <Route path="pesen-desain" element={<PesenDesainPage />} />
            <Route path="create-event" element={<CreateEventPage />} />
            <Route path="settings" element={<PlaceholderPage title="Settings" />} />

            {/* Upload routes */}
            <Route path="upload/:type" element={<UploadPage />} />

            {/* Aksara area routes */}
            <Route path="cda" element={<CDADashboard />} />
            <Route path="heg" element={<HEGDashboard />} />
            <Route path="mbd" element={<MBDDashboard />} />
            <Route path="korvoks" element={<KorvoksDashboard />} />
            <Route path="bph" element={<BPHDashboard />} />
            <Route path="admin" element={<PlaceholderPage title="Admin Panel" />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
