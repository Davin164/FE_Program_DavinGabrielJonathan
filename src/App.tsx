import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { RoleGuard } from './components/common/RoleGuard';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { MembersPage } from './pages/members/MembersPage';
import { MemberDetailPage } from './pages/members/MemberDetailPage';
import { MemberFormPage } from './pages/members/MemberFormPage';
import { EventsPage } from './pages/events/EventsPage';
import { EventDetailPage } from './pages/events/EventDetailPage';
import { EventFormPage } from './pages/events/EventFormPage';
import { AttendancePage } from './pages/attendance/AttendancePage';
import { ProfilePage } from './pages/profile/ProfilePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2, // 2 minutes
    },
  },
});

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Toaster position="top-right" richColors closeButton />
            <Routes>
              {/* Public Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected App Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                {/* Default route redirects to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Dashboard */}
                <Route path="/dashboard" element={<DashboardPage />} />

                {/* Members */}
                <Route path="/members" element={<MembersPage />} />
                <Route
                  path="/members/new"
                  element={
                    <RoleGuard allowedRoles={['LEAD', 'CO_LEAD']}>
                      <MemberFormPage />
                    </RoleGuard>
                  }
                />
                <Route path="/members/:id" element={<MemberDetailPage />} />
                <Route
                  path="/members/:id/edit"
                  element={
                    <RoleGuard allowedRoles={['LEAD', 'CO_LEAD']}>
                      <MemberFormPage />
                    </RoleGuard>
                  }
                />

                {/* Events */}
                <Route path="/events" element={<EventsPage />} />
                <Route
                  path="/events/new"
                  element={
                    <RoleGuard
                      allowedRoles={[
                        'LEAD',
                        'CO_LEAD',
                        'SECRETARY',
                        'TREASURER',
                        'TECHNICAL_DIVISION',
                        'NON_TECHNICAL_DIVISION',
                      ]}
                    >
                      <EventFormPage />
                    </RoleGuard>
                  }
                />
                <Route path="/events/:id" element={<EventDetailPage />} />
                <Route
                  path="/events/:id/edit"
                  element={
                    <RoleGuard
                      allowedRoles={[
                        'LEAD',
                        'CO_LEAD',
                        'SECRETARY',
                        'TREASURER',
                        'TECHNICAL_DIVISION',
                        'NON_TECHNICAL_DIVISION',
                      ]}
                    >
                      <EventFormPage />
                    </RoleGuard>
                  }
                />

                {/* Attendance */}
                <Route path="/attendance" element={<AttendancePage />} />

                {/* User Profile */}
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* Catch-all 404 Route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
