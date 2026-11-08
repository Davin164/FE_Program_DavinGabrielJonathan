# GDGoC UNSRI Management System — Front-End Application

> **Google Developer Groups on Campus (GDGoC) Universitas Sriwijaya**  
> Sistem manajemen Core Team dan anggota: React 18 + TypeScript + Vite + Tailwind CSS + TanStack Query, dengan Supabase sebagai Backend-as-a-Service (PostgreSQL).

| Informasi | Keterangan |
| :-- | :-- |
| **Live Deployment (Vercel)** | https://fe-program-davin-gabriel-jonathan.vercel.app |
| **Repository GitHub** | https://github.com/Davin164/FE_Program_DavinGabrielJonathan |
| **BaaS** | Supabase (PostgreSQL) |

## GDGoC UNSRI Brand Palette

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

## Tech Stack

- **Framework**: React 18 + TypeScript 5 via Vite 5
- **Styling**: Tailwind CSS v3 (palet resmi GDGoC di `tailwind.config.ts`)
- **Routing**: React Router DOM v6 (nested layout, `ProtectedRoute`, `RoleGuard`)
- **Server State**: TanStack Query v5 (cache, invalidasi otomatis setelah mutasi)
- **Form & Validasi**: React Hook Form + Zod
- **BaaS**: `@supabase/supabase-js` — query ke PostgreSQL Supabase melalui `src/services/supabaseService.ts`
- **Auth**: email + password (hash bcrypt) dan Google OAuth (Supabase Auth)
- **UI**: Lucide React, Sonner (toast notification)
- **Deployment**: Vercel (`vercel.json` konfigurasi SPA rewrite)

## Role (RBAC) dan Akun Pengujian

Sistem mendukung 8 role kepengurusan. Seluruh akun pengujian menggunakan password `Password123!`.

| Role | Email | Wewenang |
| :--- | :--- | :--- |
| **LEAD** | `lead.gdgoc@gmail.com` | Akses penuh. Menambah akun (Co-Lead hingga Member), mengubah role, menghapus anggota. |
| **CO_LEAD** | `colead.gdgoc@gmail.com` | Eksekutif: membuat, mengubah, menghapus event, memantau absensi, melihat Audit Log. |
| **SECRETARY_1** | `sec1.gdgoc@gmail.com` | Eksekutif. |
| **SECRETARY_2** | `sec2.gdgoc@gmail.com` | Eksekutif. |
| **TREASURER_1** | `treas1.gdgoc@gmail.com` | Eksekutif. |
| **TREASURER_2** | `treas2.gdgoc@gmail.com` | Eksekutif. |
| **CORE_TEAM** | `core.tech@gmail.com` / `core.ml@gmail.com` | Eksekutif tingkat divisi: kelola event dan absensi. |
| **MEMBER** | `davin4@gmail.com` / `member.gdgoc@gmail.com` | Daftar/batal event, check-in dan batal absen mandiri. |

### Aturan Akses
- Registrasi publik (`/register`) hanya menghasilkan role `MEMBER`.
- Tambah anggota, ubah role, dan hapus anggota dibatasi khusus role `LEAD` (dilindungi `RoleGuard` dan tombol disembunyikan di UI).
- Buat, ubah, dan hapus event dapat diakses oleh Lead dan seluruh Core Team eksekutif.
- Panel Audit Log di Dashboard hanya ditampilkan bagi pengurus.
- Halaman login menyediakan tombol pilihan akun pengujian untuk mengisi email dan password secara otomatis.

12 divisi GDGoC UNSRI: Machine Learning, Cyber Security, Game Development, Mobile Development, Web Development, UI/UX, Project Management, Human Resource, Public Relation, Creative Design, Videography, Copywriting.

## Fitur dan Aturan Bisnis

| Area | Perilaku Sistem |
| :--- | :--- |
| **Anggota** | Direktori dengan pencarian real-time, filter role & divisi, sorting server-side, pagination, serta soft delete (`is_deleted`). |
| **Event** | Manajemen event dan kuota. Pendaftaran ganda dicegah constraint `UNIQUE(user_id, event_id)`. Kuota penuh ditolak. |
| **Absensi** | Tombol check-in hanya aktif saat jadwal event berlangsung (`start_time <= now <= end_time`) bagi peserta terdaftar. Satu check-in per anggota per event (`UNIQUE`). Tersedia aksi pembatalan absensi. |
| **Audit Log** | Mencatat aktor, aksi, data lama dan data baru untuk setiap mutasi sensitif (`UPDATE_ROLE`, `PROFILE_UPDATED`, `MEMBER_CREATED`, `MEMBER_DELETED`, `EVENT_CREATED`, `EVENT_UPDATED`, `EVENT_DELETED`). |
| **Dashboard** | Total Members, Completed Events, Upcoming Events, daftar event mendatang, dan panel Audit Log. |

## Struktur Proyek

```
FE_Program_DavinGabrielJonathan/
├── public/LogoGDG.webp                  # Logo resmi GDGoC UNSRI
├── supabase/
│   ├── setup.sql                        # Skema + seed awal
│   └── hardening.sql                    # Aturan DB: kuota atomik & jendela absensi
├── src/
│   ├── components/
│   │   ├── common/                      # DataTable, ConfirmDialog, EmptyState, ErrorBoundary, LoadingSpinner,
│   │   │                                # PageHeader, ProtectedRoute, RoleBadge, RoleGuard, SearchInput, StatusBadge
│   │   ├── forms/                       # EventForm, MemberForm, ProfileForm (React Hook Form + Zod)
│   │   └── layout/                      # AppLayout, Navbar, Sidebar
│   ├── contexts/AuthContext.tsx         # Sesi login, Google OAuth listener
│   ├── hooks/                           # useAuth, useEvents, useMembers, useRegistrations, useAttendances, useAuditLogs
│   ├── lib/                             # supabase.ts, utils.ts
│   ├── services/supabaseService.ts      # Lapisan akses data terpusat
│   ├── pages/                           # auth, dashboard, members, events, attendance, profile
│   ├── constants/index.ts               # Role, label, style badge
│   ├── types/index.ts                   # Tipe TypeScript
│   ├── App.tsx                          # Router + route guards
│   └── main.tsx
├── .env.example · vercel.json · github.txt · package.json · README.md
```

Halaman rute aplikasi (13 rute): `/login`, `/register`, `/dashboard`, `/members`, `/members/new`, `/members/:id`, `/members/:id/edit`, `/events`, `/events/new`, `/events/:id`, `/events/:id/edit`, `/attendance`, `/profile`.

## Menjalankan Secara Lokal

Prasyarat: Node.js v18 atau lebih baru.

```bash
npm install
npm run dev
```
Aplikasi berjalan pada `http://localhost:5173`.

Build produksi dan type-check:
```bash
npm run build
```

### Konfigurasi Environment (`.env`)
File `.env` sudah disertakan di dalam folder proyek dan terhubung ke project Supabase aktif.
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-publishable-key
```

## Setup Database Supabase (Project Baru)

1. Buka Supabase SQL Editor.
2. Jalankan `supabase/setup.sql` untuk membuat tabel, relasi, dan seed data.
3. Jalankan `supabase/hardening.sql` untuk memastikan trigger database aktif:
   - `trg_enforce_event_quota` — `SELECT ... FOR UPDATE` pada baris event agar pendaftar konkuren tidak melebihi kuota.
   - `trg_enforce_attendance_window` — validasi waktu kehadiran `start_time <= now <= end_time`.

## Deploy ke Vercel

1. Import repository GitHub di Vercel (Preset: Vite).
2. Konfigurasikan Environment Variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
3. Deploy. File `vercel.json` menangani routing client-side SPA.

## Skenario Pengujian

1. Login Lead -> buka Members -> ubah role anggota -> buka Dashboard: Audit Log menampilkan Lead sebagai aktor dan perubahan role.
2. Login Member -> Attendance -> event mendatang tombol disabled; event aktif tombol aktif untuk check-in dan pembatalan absen.
3. Daftarkan akun ke event berkuota penuh -> sistem menolak pendaftaran dengan notifikasi yang jelas.
4. Registrasi akun baru di `/register` -> role otomatis ditetapkan sebagai Member.

## Batasan Saat Ini dan Rencana Perbaikan

- **Otorisasi berlapis di sisi klien dan constraint database:** Penegakan aturan kuota dan jadwal absensi sudah berjalan di level trigger database PostgreSQL. Otorisasi role saat ini diverifikasi pada layer service aplikasi.
- **Rencana perbaikan:** Migrasi menyeluruh ke Supabase Auth Native Token sehingga kebijakan Row Level Security (RLS) PostgreSQL dapat mengevaluasi context `auth.uid()` dan klaim JWT langsung di level database engine.

Davin Gabriel Jonathan — GDGoC UNSRI Core Team Selection
