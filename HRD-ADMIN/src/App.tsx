import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdminLayout from "@/components/AdminLayout";
import Dashboard from "@/pages/Dashboard";
import PropertiesPage from "@/pages/PropertiesPage";
import CommercialPage from "@/pages/CommercialPage";
import ProjectsPage from "@/pages/ProjectsPage";
import InquiriesPage from "@/pages/InquiriesPage";
import TestimonialsStatsPage from "./pages/TestimonialsStaticPage.tsx";
import LoginPage from "@/pages/LoginPage";
import NotFound from "./pages/NotFound.tsx";
import useAuthStore from "@/stores/useAuthStore";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary animate-pulse font-serif text-lg">Loading...</div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App = () => {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    const unsub = init();
    return unsub;
  }, [init]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/commercial" element={<CommercialPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/inquiries" element={<InquiriesPage />} />
              <Route path="/content" element={<TestimonialsStatsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
