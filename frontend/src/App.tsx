import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth/AuthProvider";
import { AppShell } from "./components/AppShell";
import { TasksDashboardPage } from "./pages/TasksDashboardPage";
import { LandingPage } from "./pages/LandingPage";
import { SignUpPage } from "./pages/SignUpPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { ProfilePage } from "./pages/ProfilePage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { idToken, ready } = useAuth();

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-base-200" role="status" aria-label="Loading account">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!idToken) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export function App() {
  const { idToken, ready } = useAuth();

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-base-200" role="status" aria-label="Loading account">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <Routes>
      <Route index element={idToken ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/signup" element={idToken ? <Navigate to="/dashboard" replace /> : <SignUpPage />} />
      <Route path="/forgot-password" element={idToken ? <Navigate to="/dashboard" replace /> : <ForgotPasswordPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<TasksDashboardPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to={idToken ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
}
