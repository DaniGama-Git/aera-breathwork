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
import CategoryLibrary from "./pages/CategoryLibrary.tsx";
import BreathworkMenu from "./pages/BreathworkMenu.tsx";
import SearchScreen from "./pages/SearchScreen.tsx";
import Auth from "./pages/Auth.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import Recommendation from "./pages/Recommendation.tsx";
import Extension from "./pages/Extension.tsx";
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
  const [checkedPath, setCheckedPath] = useState<string | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    if (!user) {
      setNeedsOnboarding(false);
      setOnboardingChecked(true);
      setCheckedPath(location.pathname);
      return;
    }

    let isActive = true;
    setOnboardingChecked(false);
    setCheckedPath(null);

    const checkOnboarding = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!isActive) return;

      if (error) {
        setNeedsOnboarding(false);
      } else {
        setNeedsOnboarding(!data?.onboarding_completed);
      }
      setOnboardingChecked(true);
      setCheckedPath(location.pathname);
    };

    void checkOnboarding();

    return () => {
      isActive = false;
    };
  }, [user, location.pathname]);

  const isCurrentPathChecked = onboardingChecked && checkedPath === location.pathname;

  if (loading || !isCurrentPathChecked) return <LoadingSpinner />;
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
          <Route path="/recommendation" element={<ProtectedRoute><Recommendation /></ProtectedRoute>} />
          <Route path="/menu" element={<ProtectedRoute><BreathworkMenu /></ProtectedRoute>} />
          <Route path="/breathwork-session-activate" element={<ProtectedRoute><BreathworkSession /></ProtectedRoute>} />
          <Route path="/breathwork-session-recover" element={<ProtectedRoute><BreathworkSessionRecover /></ProtectedRoute>} />
          <Route path="/breathwork-session-focus" element={<ProtectedRoute><BreathworkSessionFocus /></ProtectedRoute>} />
          <Route path="/breathwork-session-reset" element={<ProtectedRoute><BreathworkSessionReset /></ProtectedRoute>} />
          <Route path="/hrv" element={<ProtectedRoute><HrvDemo /></ProtectedRoute>} />
          <Route path="/category/:slug" element={<ProtectedRoute><CategoryLibrary /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchScreen /></ProtectedRoute>} />
          <Route path="/extension" element={<Extension />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
