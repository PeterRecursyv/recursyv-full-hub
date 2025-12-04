import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import IntegrationDetail from "./pages/IntegrationDetail";
import Purchase from "./pages/Purchase";
import PurchaseSuccess from "./pages/PurchaseSuccess";

function Router() {
  return (
    <Switch>
      {/* Homepage with hub selection */}
      <Route path={"/"} component={Home} />
      
      {/* Multi-hub routes */}
      <Route path={"/hub/:hubId/integration/:spokeId"} component={IntegrationDetail} />
      <Route path={"/hub/:hubId/purchase"} component={Purchase} />
      <Route path={"/purchase-success"} component={PurchaseSuccess} />
      
      {/* 404 */}
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
