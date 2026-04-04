import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import HomeScreen from "./pages/HomeScreen.tsx";
import NotFound from "./pages/NotFound.tsx";
import WavePreview from "./pages/WavePreview.tsx";
import DynamicSession from "./pages/DynamicSession.tsx";
import HrvDemo from "./pages/HrvDemo.tsx";
import CategoryLibrary from "./pages/CategoryLibrary.tsx";
import BreathworkMenu from "./pages/BreathworkMenu.tsx";
import SearchScreen from "./pages/SearchScreen.tsx";
import Auth from "./pages/Auth.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import Extension from "./pages/Extension.tsx";
import CalendarSetup from "./pages/CalendarSetup.tsx";
import BreatheDots from "@/components/BreatheDots";

const queryClient = new QueryClient();

const LoadingSpinner = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <BreatheDots className="w-12 h-12" />
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    if (!user) {
      setNeedsOnboarding(false);
      setOnboardingChecked(true);
      return;
    }

    let active = true;
    setOnboardingChecked(false);

    supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        setNeedsOnboarding(!error && !data?.onboarding_completed);
        setOnboardingChecked(true);
      });

    return () => { active = false; };
  }, [user]);

  if (loading || !onboardingChecked) return <LoadingSpinner />;
  if (!user) return <Navigate to="/auth" replace />;

  if (needsOnboarding && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }
  if (!needsOnboarding && location.pathname === "/onboarding") {
    return <Navigate to="/menu" replace />;
  }

  return <>{children}</>;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (user) return <Navigate to="/menu" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/menu" element={<ProtectedRoute><BreathworkMenu /></ProtectedRoute>} />
          <Route path="/session/:category/:slug" element={<ProtectedRoute><DynamicSession /></ProtectedRoute>} />
          {/* Legacy redirects */}
          <Route path="/breathwork-session-activate" element={<Navigate to="/session/activate/wake-me-up" replace />} />
          <Route path="/breathwork-session-recover" element={<Navigate to="/session/recover/back-to-back" replace />} />
          <Route path="/breathwork-session-focus" element={<Navigate to="/session/perform/deep-focus" replace />} />
          <Route path="/breathwork-session-reset" element={<Navigate to="/session/ground/wind-down" replace />} />
          <Route path="/hrv" element={<ProtectedRoute><HrvDemo /></ProtectedRoute>} />
          <Route path="/category/:slug" element={<ProtectedRoute><CategoryLibrary /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchScreen /></ProtectedRoute>} />
          <Route path="/extension" element={<Extension />} />
          <Route path="/calendar-setup" element={<CalendarSetup />} />
          <Route path="/wave" element={<WavePreview />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
