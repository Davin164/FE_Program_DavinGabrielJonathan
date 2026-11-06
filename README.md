# GDGoC UNSRI Management System — Front-End Application

> **Google Developer Groups on Campus (GDGoC) Universitas Sriwijaya**  
> Complete Front-End Management Web Application built with React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, and Supabase Auth.

---

## 🎨 GDGoC UNSRI Brand Palette

| Color Role | Hex Code | Google Brand Color | Preview |
| :--- | :--- | :--- | :--- |
| **Primary** | `#4285F4` | Google Blue | ![#4285F4](https://via.placeholder.com/15/4285F4/000000?text=+) `#4285F4` |
| **Secondary** | `#34A853` | Google Green | ![#34A853](https://via.placeholder.com/15/34A853/000000?text=+) `#34A853` |
| **Accent / Danger** | `#EA4335` | Google Red | ![#EA4335](https://via.placeholder.com/15/EA4335/000000?text=+) `#EA4335` |
| **Warning** | `#FBBC04` | Google Yellow | ![#FBBC04](https://via.placeholder.com/15/FBBC04/000000?text=+) `#FBBC04` |
| **Background** | `#F8F9FA` | Google Light Gray | `#F8F9FA` |
| **Surface** | `#FFFFFF` | Pure White | `#FFFFFF` |
| **Text Primary** | `#202124` | Dark Charcoal | `#202124` |
| **Text Secondary** | `#5F6368` | Slate Muted Gray | `#5F6368` |

---

## 🚀 Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/) via [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Routing**: [React Router DOM v6](https://reactrouter.com/) (with Nested Layouts, Protected Routes, and Role Guards)
- **Data & Server State**: [TanStack Query v5](https://tanstack.com/query/latest) (React Query)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Authentication**: [Supabase](https://supabase.com/) (Google OAuth + Email/Password) + JWT token management
- **HTTP Client**: [Axios](https://axios-http.com/) with request/response interceptors (Auto JWT attachment and Refresh Token rotation queue)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Date Utilities**: [date-fns v3](https://date-fns.org/)
- **Deployment**: Vercel ready

---

## 🔐 Role-Based Access Control (RBAC)

The system enforces strict client-side role guards paired with backend verification:

| Feature / Page | LEAD | DIVISION_HEAD | MEMBER |
| :--- | :---: | :---: | :---: |
| **Dashboard Statistics** | Full Chapter Stats | Chapter Stats | Personal / Event Stats |
| **Member Directory** | View, Add, Edit, Delete | View Directory | View Directory |
| **Events & Workshops** | View, Create, Edit, Delete | View, Create, Edit | View, Register / Unregister |
| **Attendance Check-in** | View Roster & Validate | View Roster & Validate | Self Check-in to Live Session |
| **Security Audit Logs** | ✅ Full Access & Diff | ❌ Restricted (403) | ❌ Restricted (403) |
| **Profile Management** | Edit Own Profile | Edit Own Profile | Edit Own Profile |

---

## 📁 Project Structure

```
FE_Program_DavinGabrielJonathan/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── ConfirmDialog.tsx       # Reusable alert modal for sensitive actions
│   │   │   ├── DataTable.tsx           # Sortable, paginated, responsive data table
│   │   │   ├── EmptyState.tsx          # Clean SVG empty states with actionable buttons
│   │   │   ├── ErrorBoundary.tsx       # Catch unhandled UI exceptions gracefully
│   │   │   ├── LoadingSpinner.tsx      # Standardized animated loaders
│   │   │   ├── PageHeader.tsx          # Header with breadcrumbs and action triggers
│   │   │   ├── ProtectedRoute.tsx      # Route wrapper verifying authentication
│   │   │   ├── RoleBadge.tsx           # Role-based colored chips (LEAD, DIV_HEAD, MEMBER)
│   │   │   ├── RoleGuard.tsx           # 403 Forbidden protection component
│   │   │   ├── SearchInput.tsx         # Debounced search bar with instant clear
│   │   │   └── StatusBadge.tsx         # Event state badges (Upcoming, Live, Full, Past)
│   │   ├── forms/
│   │   │   ├── EventForm.tsx           # React Hook Form + Zod for event creation/edit
│   │   │   ├── MemberForm.tsx          # React Hook Form + Zod for member creation/edit
│   │   │   └── ProfileForm.tsx         # Form for profile & password updating
│   │   └── layout/
│   │       ├── AppLayout.tsx           # Master layout with responsive sidebar & navbar
│   │       ├── Navbar.tsx              # Top bar with user profile dropdown & logout
│   │       └── Sidebar.tsx             # Collapsible navigation drawer
│   ├── contexts/
│   │   └── AuthContext.tsx             # Global auth state, Supabase listener, token storage
│   ├── hooks/
│   │   ├── useAttendances.ts           # React Query hooks for attendance check-ins
│   │   ├── useAuditLogs.ts             # React Query hooks for security logs
│   │   ├── useAuth.ts                  # Context consumption helper
│   │   ├── useEvents.ts                # React Query hooks for event CRUD & stats
│   │   ├── useMembers.ts               # React Query hooks for member CRUD & divisions
│   │   └── useRegistrations.ts         # React Query hooks for event registrations
│   ├── lib/
│   │   ├── axios.ts                    # Axios instance with 401 refresh token interceptor
│   │   ├── supabase.ts                 # Supabase client initialization
│   │   └── utils.ts                    # Date formatters, initials generator, cn()
│   ├── pages/
│   │   ├── attendance/
│   │   │   └── AttendancePage.tsx      # Check-in interface & attendee roster
│   │   ├── audit-logs/
│   │   │   └── AuditLogsPage.tsx       # Security audit log table with JSON diff modal
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx           # Email/password + Google OAuth login
│   │   │   └── RegisterPage.tsx        # Member registration form
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx       # Overview metrics & quick action hub
│   │   ├── events/
│   │   │   ├── EventDetailPage.tsx     # Quota progress, registration & roster
│   │   │   ├── EventFormPage.tsx       # Create / edit event wrapper
│   │   │   └── EventsPage.tsx          # Card grid view with search & status filters
│   │   ├── members/
│   │   │   ├── MemberDetailPage.tsx   # Detailed member academic & chapter view
│   │   │   ├── MemberFormPage.tsx      # Add / edit member form
│   │   │   └── MembersPage.tsx         # Directory with server sort, search & filters
│   │   └── profile/
│   │       └── ProfilePage.tsx         # Personal settings & password management
│   ├── constants/
│   │   └── index.ts                    # Routes, role constants, storage keys
│   ├── types/
│   │   └── index.ts                    # Full TypeScript interfaces and payload types
│   ├── App.tsx                         # Router configuration, providers & routes
│   ├── index.css                       # Tailwind directives, custom scrollbars
│   └── main.tsx                        # React 18 DOM mount point
├── public/
│   └── gdgoc-logo.svg                  # SVG logo for GDGoC UNSRI
├── .env.example                        # Template for environment variables
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- **Node.js** >= 18.0.0
- **npm**, **pnpm**, or **yarn**

### 2. Install Dependencies
```bash
cd Soal2_CaseStudy/FE_Program_DavinGabrielJonathan
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update values as required:
```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 5. Production Build
```bash
npm run build
```
Verify the build locally:
```bash
npm run preview
```

---

## 💡 Key Design & Implementation Decisions

1. **Robust Token Refresh Interceptor**: The Axios interceptor uses a queue-based token refresh mechanism to handle concurrent 401 responses smoothly without duplicate refresh requests.
2. **Graceful Fallbacks**: When backend endpoints are starting up or offline, essential dropdowns (such as Divisions and default dashboard stats) provide sensible fallback data so UI testing and navigation are never blocked.
3. **Strict TypeScript & Schema Validation**: 100% of forms utilize Zod schemas with strong type inference, eliminating `any` types across the entire application.
4. **Rich Interactive Feedback**: Real-time feedback via Sonner toast notifications, optimistic UI invalidations via TanStack Query, and confirmation dialogs for destructive actions.
5. **Mobile-First Responsive Design**: Full drawer sidebar support for mobile and tablet screens, responsive grid views for event cards, and horizontal scroll tables with custom subtle scrollbars.

---
**Developed for GDGoC UNSRI Selection — Davin Gabriel Jonathan**
