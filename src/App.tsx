import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PredictionProvider } from "@/contexts/PredictionContext";
import AppLayout from "@/layouts/AppLayout";
import Dashboard from "@/pages/Dashboard";
import HowItWorksPage from "@/pages/HowItWorksPage";
import PredictPage from "@/pages/PredictPage";
import ResultsPage from "@/pages/ResultsPage";
import HistoryPage from "@/pages/HistoryPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PredictionProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/predict" element={<PredictPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PredictionProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
