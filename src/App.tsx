import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BloodDonationProvider } from "@/contexts/BloodDonationContext";
import Index from "./pages/Index";
import DonorsPage from "./pages/DonorsPage";
import RequestBloodPage from "./pages/RequestBloodPage";
import RegisterDonorPage from "./pages/RegisterDonorPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AdminLogin from "./pages/AdminLogin";
import HospitalLogin from "./pages/HospitalLogin";
import HospitalDashboard from "./pages/HospitalDashboard";
import BloodRequestsPage from "./pages/BloodRequestsPage";
import DonorLogin from "./pages/DonorLogin";
import DonorProfile from "./pages/DonorProfile";
import Help from "./pages/HelpPage";
import HospitalsPage from "./pages/HospitalsPage";
import Info from "./pages/Info";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BloodDonationProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/donors" element={<DonorsPage />} />
            <Route path="/request" element={<RequestBloodPage />} />
            <Route path="/register" element={<RegisterDonorPage />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            <Route
               path="/admin"
               element={
               <ProtectedAdminRoute>
               <AdminPage />
               </ProtectedAdminRoute>
               }
              />
              <Route path="/hospital-login" element={<HospitalLogin />} />
              <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
              <Route path="/requested" element={<BloodRequestsPage />} />
              <Route path="/donor-login" element={<DonorLogin />} />
              <Route path="/donor-dashboard" element={<DonorProfile />} />
              <Route path="/help" element={<Help />} />
              <Route path="/Organisations" element={<HospitalsPage />} />
              <Route path="/Info" element={<Info />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </BloodDonationProvider>
  </QueryClientProvider>
);

export default App;
