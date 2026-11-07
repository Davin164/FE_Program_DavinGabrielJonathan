# GDGoC UNSRI Management System — Front-End Application

> **Google Developer Groups on Campus (GDGoC) Universitas Sriwijaya**  
> Full-Stack Management Web Application built with React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, and Supabase Auth.

---

## 🎨 GDGoC UNSRI Brand Palette

| Color Role | Hex Code | Google Brand Color |
| :--- | :--- | :--- |
| **Primary** | `#4285F4` | Google Blue |
| **Secondary** | `#34A853` | Google Green |
| **Accent / Danger** | `#EA4335` | Google Red |
| **Warning** | `#FBBC04` | Google Yellow |
| **Background** | `#F8F9FA` | Google Light Gray |
| **Surface** | `#FFFFFF` | Pure White |
| **Text Primary** | `#202124` | Dark Charcoal |
| **Text Secondary** | `#5F6368` | Slate Muted Gray |

---

## 🚀 Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/) via [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Routing**: [React Router DOM v6](https://reactrouter.com/) (Nested Layouts, Protected Routes, Role Guards)
- **Server State**: [TanStack Query v5](https://tanstack.com/query/latest) (React Query)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **BaaS & Auth**: [Supabase](https://supabase.com/) (Google OAuth + Cloud PostgreSQL) + JWT Token Management
- **HTTP Client**: [Axios](https://axios-http.com/) with Request/Response Interceptors (Auto Bearer attachment & Refresh Token rotation queue)
- **Icons & UI**: [Lucide React](https://lucide.dev/) & [Sonner](https://sonner.emilkowal.ski/)
- **Deployment**: [Vercel](https://vercel.com/) (`vercel.json` SPA rewrites configured)

---

## 🔐 Role-Based Access Control (RBAC) & Test Accounts

Aplikasi menerapkan 7 Role resmi sesuai struktur kepengurusan GDGoC Universitas Sriwijaya:

| Role | Email | Password | Cakupan Wewenang |
| :--- | :--- | :--- | :--- |
| **LEAD** | `lead@gdgoc.unsri.ac.id` | `Password123!` | Pimpinan tertinggi chapter; akses penuh ke seluruh manajemen anggota, ubah role, buat/hapus event, kelola absensi. |
| **CO_LEAD** | `colead@gdgoc.unsri.ac.id` | `Password123!` | Wakil pimpinan chapter; mengelola anggota, membuat event, dan memantau kehadiran. |
| **SECRETARY** | `secretary@gdgoc.unsri.ac.id` | `Password123!` | Sekretaris chapter; mengelola administrasi, membuat event, dan memantau kehadiran kegiatan. |
| **TREASURER** | `treasurer@gdgoc.unsri.ac.id` | `Password123!` | Bendahara chapter; mengelola pendataan operasional kegiatan, membuat event, dan memantau kehadiran. |
| **TECHNICAL_DIVISION** | `tech@gdgoc.unsri.ac.id` | `Password123!` | Divisi teknis (Web, Mobile, Cloud, AI); mengorganisir workshop teknis, hands-on labs, dan absensi peserta. |
| **NON_TECHNICAL_DIVISION** | `nontech@gdgoc.unsri.ac.id` | `Password123!` | Divisi non-teknis (Creative UI/UX, PR, Logistics); mengelola event komunitas, seminar, dan presensi. |
| **MEMBER** | `davin@gdgoc.unsri.ac.id` | `Password123!` | Anggota terdaftar; eksplorasi kegiatan, pendaftaran event bersaing, self check-in saat acara berlangsung. |
| **MEMBER (Secondary)** | `member2@gdgoc.unsri.ac.id` | `Password123!` | Akun anggota kedua untuk pengujian perebutan kuota (*race condition*). |

---

## 📁 Project Structure

```
FE_Program_DavinGabrielJonathan/
├── public/
│   └── LogoGDG.webp                    # Official GDGoC UNSRI chapter logo
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── ConfirmDialog.tsx       # Reusable alert modal for destructive actions
│   │   │   ├── DataTable.tsx           # Generic sortable, paginated, responsive data table
│   │   │   ├── EmptyState.tsx          # Clean empty states with actionable buttons
│   │   │   ├── ErrorBoundary.tsx       # Catch unhandled UI exceptions gracefully
│   │   │   ├── LoadingSpinner.tsx      # Standardized animated loaders
│   │   │   ├── PageHeader.tsx          # Header with breadcrumbs and action triggers
│   │   │   ├── ProtectedRoute.tsx      # Route wrapper verifying authentication
│   │   │   ├── RoleBadge.tsx           # Role-based colored chips (LEAD, DIV_HEAD, MEMBER)
│   │   │   ├── RoleGuard.tsx           # 403 Forbidden protection component
│   │   │   ├── SearchInput.tsx         # Debounced search bar with instant clear
│   │   │   └── StatusBadge.tsx         # Event state badges (Upcoming, Live Now, Full, Completed)
│   │   ├── forms/
│   │   │   ├── EventForm.tsx           # React Hook Form + Zod for event creation/edit
│   │   │   ├── MemberForm.tsx          # React Hook Form + Zod for member creation/edit
│   │   │   └── ProfileForm.tsx         # Form for personal profile credentials
│   │   └── layout/
│   │       ├── AppLayout.tsx           # Master layout with responsive sidebar & navbar
│   │       ├── Navbar.tsx              # Top bar with user profile dropdown & logout
│   │       └── Sidebar.tsx             # Collapsible navigation drawer
│   ├── contexts/
│   │   └── AuthContext.tsx             # Global auth state, Supabase OAuth listener, token storage
│   ├── hooks/
│   │   ├── useAttendances.ts           # React Query hooks for attendance check-ins
│   │   ├── useAuth.ts                  # Auth context consumption hook
│   │   ├── useEvents.ts                # React Query hooks for event CRUD
│   │   ├── useMembers.ts               # React Query hooks for member CRUD, role mutation & divisions
│   │   └── useRegistrations.ts         # React Query hooks for event registrations
│   ├── lib/
│   │   ├── axios.ts                    # Axios instance with 401 refresh token rotation interceptor
│   │   ├── supabase.ts                 # Supabase BaaS client initialization
│   │   └── utils.ts                    # Date formatters, initials generator, error parser, cn()
│   ├── pages/
│   │   ├── attendance/
│   │   │   └── AttendancePage.tsx      # Self check-in interface & live attendee roster
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx           # Email/password + Google OAuth login via Supabase
│   │   │   └── RegisterPage.tsx        # Member registration form
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx       # Chapter metrics (Members, Completed & Upcoming Events)
│   │   ├── events/
│   │   │   ├── EventDetailPage.tsx     # Quota progress, registration & attendee roster
│   │   │   ├── EventFormPage.tsx       # Create / edit event page
│   │   │   └── EventsPage.tsx          # Card grid view with search & Upcoming/Completed filters
│   │   ├── members/
│   │   │   ├── MemberDetailPage.tsx    # Detailed member academic & chapter view
│   │   │   ├── MemberFormPage.tsx      # Add / edit member page (LEAD only)
│   │   │   └── MembersPage.tsx         # Directory with server sort, search, filter & pagination
│   │   └── profile/
│   │       └── ProfilePage.tsx         # Personal profile settings
│   ├── constants/
│   │   └── index.ts                    # API endpoints, role labels, storage keys
│   ├── types/
│   │   └── index.ts                    # Strict TypeScript interfaces & API contracts
│   ├── App.tsx                         # Router configuration, QueryClient & route guards
│   ├── index.css                       # Tailwind directives & custom subtle scrollbars
│   └── main.tsx                        # React 18 DOM entry point
├── .env.example                        # Template for environment variables
├── vercel.json                         # SPA client-side routing rewrite rules for Vercel
├── package.json
└── README.md
```

---

## ⚙️ Installation & Local Setup

### 1. Prerequisites
- **Node.js** >= 18.0.0
- Running Back-End API (`http://localhost:3000/api` or deployed API URL)

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in the configuration values:
```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 5. Build for Production
```bash
npm run build
```

---

## 🌐 Deploying to Vercel & Supabase BaaS

1. **GitHub Repository**: [https://github.com/Davin164/FE_Program_DavinGabrielJonathan](https://github.com/Davin164/FE_Program_DavinGabrielJonathan)
2. In **Supabase Dashboard**:
   - Copy **Project URL** (`VITE_SUPABASE_URL`) and **anon public key** (`VITE_SUPABASE_ANON_KEY`) from *Project Settings -> API*.
   - Enable **Google Provider** under *Authentication -> Providers -> Google* and add your Vercel domain (`https://your-app.vercel.app/dashboard`) to *Redirect URLs*.
3. In **Vercel Dashboard**:
   - Import the GitHub repository (`Framework Preset: Vite`).
   - Add Environment Variables: `VITE_API_URL`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_ANON_KEY`.
   - Click **Deploy**. `vercel.json` automatically handles SPA route refreshes.

---
**Developed for GDGoC UNSRI Core Team Selection — Davin Gabriel Jonathan**
