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
import BreathworkSession from "./pages/BreathworkSession.tsx";
import BreathworkSessionRecover from "./pages/BreathworkSessionRecover.tsx";
import BreathworkSessionFocus from "./pages/BreathworkSessionFocus.tsx";
import BreathworkSessionReset from "./pages/BreathworkSessionReset.tsx";
import HrvDemo from "./pages/HrvDemo.tsx";
import BreathworkMenu from "./pages/BreathworkMenu.tsx";
import Auth from "./pages/Auth.tsx";
import Onboarding from "./pages/Onboarding.tsx";

const queryClient = new QueryClient();

const LoadingSpinner = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    let isActive = true;

    if (!user) {
      setNeedsOnboarding(false);
      setOnboardingChecked(true);
      return;
    }

    supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!isActive) return;

        if (error) {
          setNeedsOnboarding(false);
        } else {
          setNeedsOnboarding(!data?.onboarding_completed);
        }

        setOnboardingChecked(true);
      });

    return () => {
      isActive = false;
    };
  }, [user]);

  if (loading || !onboardingChecked) return <LoadingSpinner />;
  if (!user) return <Navigate to="/auth" replace />;

  // Redirect to onboarding if not completed (unless already on onboarding page)
  if (needsOnboarding && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
          <Route path="/breathwork-session-activate" element={<ProtectedRoute><BreathworkSession /></ProtectedRoute>} />
          <Route path="/breathwork-session-recover" element={<ProtectedRoute><BreathworkSessionRecover /></ProtectedRoute>} />
          <Route path="/breathwork-session-focus" element={<ProtectedRoute><BreathworkSessionFocus /></ProtectedRoute>} />
          <Route path="/breathwork-session-reset" element={<ProtectedRoute><BreathworkSessionReset /></ProtectedRoute>} />
          <Route path="/hrv" element={<ProtectedRoute><HrvDemo /></ProtectedRoute>} />
          <Route path="/menu" element={<ProtectedRoute><BreathworkMenu /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
