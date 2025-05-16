import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import IncomeProjection from "./pages/IncomeProjection";
import FAQ from "./pages/FAQ";
import AdvancedLoanCalculator from "./pages/AdvancedLoanCalculator";
import Comparison from "./pages/Comparison";
import LoanComparison from "./pages/LoanComparison";
import DetailedLoanComparison from "./pages/DetailedLoanComparison";
import Fees from "./pages/Fees";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import DocumentUpload from "./pages/DocumentUpload";
import FinalSubmission from "./pages/FinalSubmission";
import LoanStatus from "./pages/LoanStatus";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// After onboarding route component
const IndexRoute = () => {
  const { user, loading, hasCompletedOnboarding } = useAuth();
  
  // Show loading spinner while checking authentication status
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // If not logged in, show the index page
  if (!user) {
    return <Index />;
  }
  
  // If logged in but hasn't completed onboarding
  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  
  // If logged in and has completed onboarding
  return <Navigate to="/dashboard" replace />;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<IndexRoute />} />
        <Route path="/income-projection" element={<IncomeProjection />} />
        <Route path="/advanced-loan-calculator" element={<AdvancedLoanCalculator />} />
        <Route path="/comparison" element={<Comparison />} />
        <Route path="/compare" element={<LoanComparison />} />
        <Route path="/compare/personalized" element={
          <ProtectedRoute>
            <LoanComparison />
          </ProtectedRoute>
        } />
        <Route path="/compare/detailed" element={<DetailedLoanComparison />} />
        <Route path="/fees" element={<Fees />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        } />
        <Route path="/document-upload" element={
          <ProtectedRoute>
            <DocumentUpload />
          </ProtectedRoute>
        } />
        <Route path="/final-submission" element={
          <ProtectedRoute>
            <FinalSubmission />
          </ProtectedRoute>
        } />
        <Route path="/loan-status" element={
          <ProtectedRoute>
            <LoanStatus />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <AnimatedRoutes />
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
