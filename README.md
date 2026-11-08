# GDGoC UNSRI Management System — Front-End Application

> **Google Developer Groups on Campus (GDGoC) Universitas Sriwijaya**
> Sistem manajemen Core Team & anggota: React 18 + TypeScript + Vite + Tailwind CSS + TanStack Query, dengan **Supabase** sebagai Backend-as-a-Service (PostgreSQL).

| | |
| :-- | :-- |
| **Live (Vercel)** | https://fe-program-davin-gabriel-jonathan.vercel.app |
| **Repository** | https://github.com/Davin164/FE_Program_DavinGabrielJonathan |
| **BaaS** | Supabase (project `your-project-id`, PostgreSQL) |

---

## 🎨 GDGoC UNSRI Brand Palette

| Color Role | Hex Code | Google Brand Color |
| :--- | :--- | :--- |
| **Primary** | `#4285F4` | Google Blue |
| **Secondary / Success** | `#34A853` | Google Green |
| **Accent / Danger** | `#EA4335` | Google Red |
| **Warning** | `#FBBC04` | Google Yellow |
| **Background** | `#F8F9FA` | Google Light Gray |
| **Surface** | `#FFFFFF` | Pure White |
| **Text Primary** | `#202124` | Dark Charcoal |
| **Text Secondary** | `#5F6368` | Slate Muted Gray |

---

## 🚀 Tech Stack

- **Framework**: React 18 + TypeScript 5 via Vite 5
- **Styling**: Tailwind CSS v3 (palet resmi GDGoC di `tailwind.config.ts`)
- **Routing**: React Router DOM v6 (nested layout, `ProtectedRoute`, `RoleGuard`)
- **Server State**: TanStack Query v5 (cache, invalidasi otomatis setelah mutasi)
- **Form & Validasi**: React Hook Form + Zod
- **BaaS**: `@supabase/supabase-js` — query langsung ke PostgreSQL Supabase lewat `src/services/supabaseService.ts` (satu-satunya lapisan akses data)
- **Auth**: email + password (hash **bcrypt** via `bcryptjs`) dan **Google OAuth** (Supabase Auth)
- **UI**: Lucide React, Sonner (toast)
- **Deployment**: Vercel (`vercel.json` berisi SPA rewrite)

---

## 🔐 Role (RBAC) & Akun Pengujian

Ada **8 role** sesuai struktur kepengurusan. Semua akun uji berpassword **`Password123!`**.

| Role | Email | Wewenang |
| :--- | :--- | :--- |
| **LEAD** | `lead.gdgoc@gmail.com` | Semua akses. **Satu-satunya** yang bisa menambah akun (Co-Lead s.d. Member), mengubah role, menghapus anggota. |
| **CO_LEAD** | `colead.gdgoc@gmail.com` | Eksekutif: tambah/ubah/hapus event, pantau & batalkan absensi, lihat Audit Log. |
| **SECRETARY_1** | `sec1.gdgoc@gmail.com` | Eksekutif (hak sama dengan Co-Lead pada event/absensi). |
| **SECRETARY_2** | `sec2.gdgoc@gmail.com` | Eksekutif. |
| **TREASURER_1** | `treas1.gdgoc@gmail.com` | Eksekutif. |
| **TREASURER_2** | `treas2.gdgoc@gmail.com` | Eksekutif. |
| **CORE_TEAM** | `core.tech@gmail.com` / `core.ml@gmail.com` | Eksekutif tingkat divisi (Web Dev / Machine Learning): kelola event & absensi. |
| **MEMBER** | `davingabrieljonathan@gmail.com` / `member.gdgoc@gmail.com` | Daftar/batal event, check-in & batal absen sendiri. |

**Aturan akses**
- Registrasi publik (`/register`) **hanya** menghasilkan role **MEMBER**.
- Tambah/ubah role/hapus anggota: **LEAD saja** (dijaga `RoleGuard` + disembunyikan di UI).
- Buat/ubah/hapus event & kelola absensi: semua role **selain MEMBER** (Lead s.d. Core Team).
- Panel **Audit Log** di Dashboard: hanya terlihat oleh role selain MEMBER.
- Halaman login menyediakan chip **"Pilihan Akun Uji Coba"** — klik untuk mengisi email & password otomatis.

**12 divisi**: Machine Learning, Cyber Security, Game Development, Mobile Development, Web Development, UI/UX, Project Management, Human Resource, Public Relation, Creative Design, Videography, Copywriting.

---

## ✅ Fitur & Aturan Bisnis

| Area | Perilaku |
| :--- | :--- |
| **Anggota** | Direktori dengan search (debounced), filter role & divisi, sorting server-side, pagination, **soft delete** (`is_deleted`). |
| **Event** | CRUD + **kuota**. Pendaftaran ganda dicegah constraint `UNIQUE(user_id, event_id)`. Kuota penuh ditolak. |
| **Absensi** | Tombol check-in **dinonaktifkan sebelum event dimulai** dan setelah selesai; aktif hanya saat jadwal berlangsung. Satu check-in per anggota per event (`UNIQUE`). Ada **Batalkan Absen** (oleh pemilik; pengurus bisa membatalkan peserta lain). |
| **Audit Log** | Mencatat siapa (aktor), apa, nilai lama → baru: `UPDATE_ROLE`, `PROFILE_UPDATED`, `MEMBER_CREATED`, `MEMBER_DELETED`, `EVENT_CREATED`, `EVENT_UPDATED`, `EVENT_DELETED`. |
| **Dashboard** | Total Members, Completed Events, Upcoming Events, daftar event mendatang, dan Audit Log. |

---

## 📁 Struktur Proyek

```
FE_Program_DavinGabrielJonathan/
├── public/LogoGDG.webp                  # Logo resmi GDGoC UNSRI
├── supabase/
│   ├── setup.sql                        # Skema + seed (⚠ menghapus & membuat ulang tabel)
│   └── hardening.sql                    # Aturan DB aman di-run ulang: kuota atomik & jendela absensi
├── src/
│   ├── components/
│   │   ├── common/                      # DataTable, ConfirmDialog, EmptyState, ErrorBoundary, LoadingSpinner,
│   │   │                                # PageHeader, ProtectedRoute, RoleBadge, RoleGuard, SearchInput, StatusBadge
│   │   ├── forms/                       # EventForm, MemberForm, ProfileForm (React Hook Form + Zod)
│   │   └── layout/                      # AppLayout, Navbar, Sidebar
│   ├── contexts/AuthContext.tsx         # Sesi login, Google OAuth listener
│   ├── hooks/                           # useAuth, useEvents, useMembers, useRegistrations, useAttendances, useAuditLogs
│   ├── lib/                             # supabase.ts (client), utils.ts
│   ├── services/supabaseService.ts      # Seluruh akses data (auth, events, members, registrations, attendances, audit)
│   ├── pages/                           # auth, dashboard, members, events, attendance, profile
│   ├── constants/index.ts               # Role, label, style badge
│   ├── types/index.ts                   # Tipe TypeScript
│   ├── App.tsx                          # Router + guard
│   └── main.tsx
├── .env.example · vercel.json · github.txt · package.json · README.md
```

**13 rute**: `/login`, `/register`, `/dashboard`, `/members`, `/members/new`, `/members/:id`, `/members/:id/edit`, `/events`, `/events/new`, `/events/:id`, `/events/:id/edit`, `/attendance`, `/profile`.

---

## ⚙️ Menjalankan Secara Lokal

Prasyarat: **Node.js ≥ 18**.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # build produksi + type-check
```

### Environment (`.env`)
File `.env` **sudah disertakan di dalam ZIP submission** dan terhubung ke project Supabase yang aktif, jadi aplikasi langsung bisa dipakai tanpa setup layanan eksternal. Untuk membuat sendiri, salin `.env.example`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable key>
```

> `.env` di-ignore oleh Git (tidak ada secret di riwayat commit). `src/lib/supabase.ts` memakai nilai ini; jika kosong, jatuh ke project Supabase publik yang sama.

---

## 🗄️ Setup Database Supabase (hanya bila membuat project baru)

1. Buka **Supabase → SQL Editor**.
2. Jalankan `supabase/setup.sql` — membuat tabel, seed akun/divisi/event, RLS, **dan** trigger aturan bisnis.
   > ⚠️ Skrip ini memiliki `DROP TABLE`. **Jangan** dijalankan di database yang sudah berisi data.
3. Untuk database yang **sudah berjalan**, cukup jalankan `supabase/hardening.sql` (aman diulang, tidak menghapus data). Isinya:
   - `trg_enforce_event_quota` — `SELECT … FOR UPDATE` pada baris event sehingga dua pendaftar yang berebut kursi terakhir tidak bisa sama-sama lolos.
   - `trg_enforce_attendance_window` — absensi hanya diterima saat `start_time ≤ now ≤ end_time`.
4. (Opsional, untuk Google Sign-In) *Authentication → Providers → Google*, lalu tambahkan URL Vercel ke *Redirect URLs*.

---

## 🌐 Deploy ke Vercel

1. Import repository GitHub (Framework Preset: **Vite**).
2. Tambahkan Environment Variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
3. Deploy. `vercel.json` menangani refresh halaman pada rute SPA.

---

## 🧪 Skenario Uji Cepat

1. Login **Lead** → buka *Members* → ubah role seorang member → buka *Dashboard*: Audit Log menampilkan **Lead** sebagai aktor dan `MEMBER ➔ CORE_TEAM`.
2. Login **Member (Davin)** → *Attendance* → pilih event mendatang: tombol **disabled**. Pilih event yang sedang berlangsung: tombol aktif → check-in → **Batalkan Absen**.
3. Daftarkan dua akun ke event berkuota 1 → akun kedua ditolak (*quota is full*).
4. Registrasi akun baru di `/register` → role otomatis **Member**.

---

## ⚠️ Batasan yang Diketahui & Rencana Perbaikan

- **Otorisasi masih berlapis di sisi klien + constraint database.** Tabel memakai kebijakan RLS terbuka (`USING (true)`) karena login memakai tabel `users` kustom, bukan Supabase Auth, sehingga database tidak dapat membedakan pemanggil. Aturan *kuota* dan *jendela absensi* sudah dipaksa di database (trigger), namun pembatasan **role** (misal hanya Lead boleh mengubah role) belum ditegakkan di database.
- **Rencana**: migrasi ke **Supabase Auth** (JWT nyata) + RLS berbasis `auth.uid()` dan role, serta memindahkan operasi sensitif (ubah role, tambah akun) ke fungsi `SECURITY DEFINER`/Edge Function. Untuk produksi, hash password tidak boleh dapat dibaca klien.

---
**Developed for GDGoC UNSRI Core Team Selection — Davin Gabriel Jonathan**
