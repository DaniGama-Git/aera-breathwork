import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomeScreen from "./pages/HomeScreen.tsx";
import NotFound from "./pages/NotFound.tsx";
import BreathworkSession from "./pages/BreathworkSession.tsx";
import BreathworkSessionRecover from "./pages/BreathworkSessionRecover.tsx";
import BreathworkSessionFocus from "./pages/BreathworkSessionFocus.tsx";
import BreathworkSessionReset from "./pages/BreathworkSessionReset.tsx";
import HrvDemo from "./pages/HrvDemo.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          {/* Screen 1: Breathwork Session Activate */}
          <Route path="/breathwork-session-activate" element={<BreathworkSession />} />
          {/* Screen 2: Breathwork Session Recover */}
          <Route path="/breathwork-session-recover" element={<BreathworkSessionRecover />} />
          {/* Screen 3: Breathwork Session Focus */}
          <Route path="/breathwork-session-focus" element={<BreathworkSessionFocus />} />
          {/* Screen 4: Breathwork Session Reset */}
          <Route path="/breathwork-session-reset" element={<BreathworkSessionReset />} />
          <Route path="/hrv" element={<HrvDemo />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
