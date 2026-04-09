import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import LandingPage from "./pages/LandingPage.tsx";
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
import MobileFrame from "@/components/MobileFrame";

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

    // Only trigger onboarding if user came through the "Add to Chrome" flow
    const isChromeFlow = sessionStorage.getItem("aera_flow") === "chrome";
    if (!isChromeFlow && location.pathname !== "/onboarding") {
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
  }, [user, location.pathname]);

  if (loading || !onboardingChecked) return <LoadingSpinner />;
  if (!user) return <Navigate to="/auth" replace />;

  if (needsOnboarding && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }
  if (!needsOnboarding && location.pathname === "/onboarding" && sessionStorage.getItem("aera_flow") === "chrome") {
    sessionStorage.removeItem("aera_flow");
    return <Navigate to="/menu" replace />;
  }

  return <>{children}</>;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) return <LoadingSpinner />;
  
  if (user) {
    // If user arrived via "Add to Chrome" flow, send to onboarding
    const params = new URLSearchParams(location.search);
    if (params.get("flow") === "chrome") {
      sessionStorage.setItem("aera_flow", "chrome");
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/menu" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/wave" element={<WavePreview />} />
          <Route path="/home" element={<MobileFrame><HomeScreen /></MobileFrame>} />
          <Route path="/auth" element={<MobileFrame><AuthRoute><Auth /></AuthRoute></MobileFrame>} />
          <Route path="/onboarding" element={<MobileFrame><ProtectedRoute><Onboarding /></ProtectedRoute></MobileFrame>} />
          <Route path="/menu" element={<MobileFrame><ProtectedRoute><BreathworkMenu /></ProtectedRoute></MobileFrame>} />
          <Route path="/session/:category/:slug" element={<MobileFrame><ProtectedRoute><DynamicSession /></ProtectedRoute></MobileFrame>} />
          {/* Legacy redirects */}
          <Route path="/breathwork-session-activate" element={<Navigate to="/session/activate/wake-me-up" replace />} />
          <Route path="/breathwork-session-recover" element={<Navigate to="/session/recover/back-to-back" replace />} />
          <Route path="/breathwork-session-focus" element={<Navigate to="/session/perform/deep-focus" replace />} />
          <Route path="/breathwork-session-reset" element={<Navigate to="/session/ground/wind-down" replace />} />
          <Route path="/hrv" element={<MobileFrame><ProtectedRoute><HrvDemo /></ProtectedRoute></MobileFrame>} />
          <Route path="/category/:slug" element={<MobileFrame><ProtectedRoute><CategoryLibrary /></ProtectedRoute></MobileFrame>} />
          <Route path="/search" element={<MobileFrame><ProtectedRoute><SearchScreen /></ProtectedRoute></MobileFrame>} />
          <Route path="/extension" element={<MobileFrame><Extension /></MobileFrame>} />
          <Route path="/calendar-setup" element={<MobileFrame><CalendarSetup /></MobileFrame>} />
          <Route path="*" element={<MobileFrame><NotFound /></MobileFrame>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
