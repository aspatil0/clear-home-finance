// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// import LoginPage from "./pages/LoginPage";
// import AdminDashboard from "./pages/AdminDashboard";
// import TreasurerDashboard from "./pages/TreasurerDashboard";
// import ResidentDashboard from "./pages/ResidentDashboard";
// import SocietySetup from "./pages/SocietySetup";
// import MaintenanceConfig from "./pages/MaintenanceConfig";
// import GenerateBills from "./pages/GenerateBills";
// import InvoiceList from "./pages/InvoiceList";
// import InvoiceDetail from "./pages/InvoiceDetail";
// import PaymentPage from "./pages/PaymentPage";
// import ReceiptPage from "./pages/ReceiptPage";
// import ResidentInvoices from "./pages/ResidentInvoices";
// import ResidentPayments from "./pages/ResidentPayments";
// import TreasurerPayments from "./pages/TreasurerPayments";
// import SuperAdminDashboard from "./pages/SuperAdminDashboard";
// import SuperAdminSocieties from "./pages/SuperAdminSocieties";
// import SuperAdminAllSocieties from "./pages/SuperAdminAllSocieties";
// import SuperAdminPaymentConfig from "./pages/SuperAdminPaymentConfig";
// import NotFound from "./pages/NotFound";

// const queryClient = new QueryClient();

// function AppRoutes() {
//   const { user } = useAuth();

//   if (!user) {
//     return (
//       <Routes>
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="*" element={<Navigate to="/login" replace />} />
//       </Routes>
//     );
//   }

//   return (
//     <Routes>
//       <Route path="/" element={<Navigate to={`/${user.role}`} replace />} />
//       <Route path="/login" element={<Navigate to={`/${user.role}`} replace />} />

//       {/* Admin */}
//       <Route path="/admin" element={<AdminDashboard />} />
//       <Route path="/admin/setup" element={<SocietySetup />} />
//       <Route path="/admin/maintenance" element={<MaintenanceConfig />} />
//       <Route path="/admin/generate-bills" element={<GenerateBills />} />
//       <Route path="/admin/invoices" element={<InvoiceList />} />
//       <Route path="/admin/invoices/:id" element={<InvoiceDetail />} />

//       {/* Treasurer */}
//       <Route path="/treasurer" element={<TreasurerDashboard />} />
//       <Route path="/treasurer/payments" element={<TreasurerPayments />} />
//       <Route path="/treasurer/invoices" element={<InvoiceList />} />

//       {/* SuperAdmin */}
//       <Route path="/superadmin" element={<SuperAdminDashboard />} />
//       <Route path="/superadmin/societies" element={<SuperAdminSocieties />} />
//       <Route path="/superadmin/all-societies" element={<SuperAdminAllSocieties />} />
//       <Route path="/superadmin/payment-config" element={<SuperAdminPaymentConfig />} />

//       {/* Resident */}
//       <Route path="/resident" element={<ResidentDashboard />} />
//       <Route path="/resident/invoices" element={<ResidentInvoices />} />
//       <Route path="/resident/payments" element={<ResidentPayments />} />
//       <Route path="/resident/pay/:id" element={<PaymentPage />} />
//       <Route path="/resident/receipt/:id" element={<ReceiptPage />} />

//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// }

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <AuthProvider>
//         <BrowserRouter>
//           <AppRoutes />
//         </BrowserRouter>
//       </AuthProvider>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import TreasurerDashboard from "./pages/TreasurerDashboard";
import ResidentDashboard from "./pages/ResidentDashboard";
import SocietySetup from "./pages/SocietySetup";
import MaintenanceConfig from "./pages/MaintenanceConfig";
import GenerateBills from "./pages/GenerateBills";
import AutoInvoice from "./pages/AutoInvoice";
import InvoiceList from "./pages/InvoiceList";
import InvoiceDetail from "./pages/InvoiceDetail";
import PaymentPage from "./pages/PaymentPage";
import ReceiptPage from "./pages/ReceiptPage";
import ResidentInvoices from "./pages/ResidentInvoices";
import ResidentPayments from "./pages/ResidentPayments";
import TreasurerPayments from "./pages/TreasurerPayments";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SuperAdminSocieties from "./pages/SuperAdminSocieties";
import SuperAdminAllSocieties from "./pages/SuperAdminAllSocieties";
import SuperAdminPaymentConfig from "./pages/SuperAdminPaymentConfig";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user } = useAuth();

  // 🔐 NOT LOGGED IN
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // ✅ LOGGED IN
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${user.role}`} replace />} />
      <Route path="/login" element={<Navigate to={`/${user.role}`} replace />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/setup" element={<SocietySetup />} />
      <Route path="/admin/maintenance" element={<MaintenanceConfig />} />
      <Route path="/admin/generate-bills" element={<GenerateBills />} />
      <Route path="/admin/auto-invoice" element={<AutoInvoice />} />
      <Route path="/admin/invoices" element={<InvoiceList />} />
      <Route path="/admin/invoices/:id" element={<InvoiceDetail />} />

      {/* Treasurer */}
      <Route path="/treasurer" element={<TreasurerDashboard />} />
      <Route path="/treasurer/payments" element={<TreasurerPayments />} />
      <Route path="/treasurer/invoices" element={<InvoiceList />} />

      {/* SuperAdmin */}
      <Route path="/superadmin" element={<SuperAdminDashboard />} />
      <Route path="/superadmin/societies" element={<SuperAdminSocieties />} />
      <Route path="/superadmin/all-societies" element={<SuperAdminAllSocieties />} />
      <Route path="/superadmin/payment-config" element={<SuperAdminPaymentConfig />} />

      {/* Resident */}
      <Route path="/resident" element={<ResidentDashboard />} />
      <Route path="/resident/invoices" element={<ResidentInvoices />} />
      <Route path="/resident/payments" element={<ResidentPayments />} />
      <Route path="/resident/pay/:id" element={<PaymentPage />} />
      <Route path="/resident/receipt/:id" element={<ReceiptPage />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </TooltipProvider>
    </QueryClientProvider>
  );
}