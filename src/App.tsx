
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthContext";
import AppLayout from "./components/layout/AppLayout";
import Index from "./pages/Index";
import LoginPage from "./components/auth/LoginPage";
import Dashboard from "./pages/Dashboard";
import Servers from "./pages/Servers";
import Configs from "./pages/Configs";
import Users from "./pages/Users";
import AppSettings from "./pages/AppSettings";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <AuthProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/servers" element={<AppLayout><Servers /></AppLayout>} />
        <Route path="/configs" element={<AppLayout><Configs /></AppLayout>} />
        <Route path="/users" element={<AppLayout><Users /></AppLayout>} />
        <Route path="/app-settings" element={<AppLayout><AppSettings /></AppLayout>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  </TooltipProvider>
);

export default App;
