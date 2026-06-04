JANGAN ubah yang sudah benar. Fix hanya masalah supervisor.

Masalah: Login dengan akun supervisor (role = "supervisor") tapi tampilanya dashboard biasa seperti Rona. Harus redirect ke /dashboard/supervisor dan hanya tampilkan menu analytics.

Cek dan fix semua file berikut:

## 1. src/components/layout/DashboardLayout.jsx
Cari function getNavItems. Pastikan kondisi supervisor dicek PERTAMA sebelum kondisi lain:

```javascript
// CEK SUPERVISOR PALING AWAL, sebelum cek rona/aksara
if (profile?.role === "supervisor") {
  items.push({ section: "Supervisor" });
  items.push({ icon: "barChart3", label: "Dashboard Analytics", path: "/dashboard/supervisor" });
  items.push({ section: "Lainnya" });
  items.push({ icon: "help", label: "FAQ", path: "/dashboard/faq" });
  return items; // RETURN LANGSUNG, jangan lanjut ke menu rona/aksara
}
```

Pastikan "return items" ada setelah supervisor menu — supaya TIDAK menambahkan menu Rona (Lomba Saya, Jadwal Saya, dll).

Juga pastikan BarChart3 ada di import lucide-react DAN di iconMap:
- Import: tambah BarChart3 di baris import dari "lucide-react"
- iconMap: tambah barChart3: BarChart3

## 2. src/pages/rona/DashboardHome.jsx
Tambah redirect di awal component:

```javascript
import { useNavigate } from "react-router-dom";
// di dalam component:
const navigate = useNavigate();
const { profile } = useAuth();

useEffect(() => {
  if (profile?.role === "supervisor") {
    navigate("/dashboard/supervisor", { replace: true });
  }
}, [profile, navigate]);
```

Ini supaya kalau supervisor masuk ke /dashboard, langsung di-redirect ke /dashboard/supervisor.

## 3. src/App.jsx
Pastikan route supervisor ADA di dalam dashboard routes:
- Cek apakah ada: <Route path="supervisor" element={<SupervisorDashboard />} />
- Cek apakah import SupervisorDashboard ada dan path-nya benar
- Kalau file SupervisorDashboard.jsx ada di src/pages/supervisor/, import harus:
  import SupervisorDashboard from "./pages/supervisor/SupervisorDashboard"

## 4. src/context/AuthContext.jsx
Pastikan ada: isSupervisor: rawRole === "supervisor"
Cari baris const rawRole dan pastikan "supervisor" dihandle.

JANGAN ubah file lain. Test: npm run build HARUS sukses.