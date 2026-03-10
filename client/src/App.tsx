import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Terms from "./pages/Terms";
import Policy from "./pages/Policy";
import AuthCallback from "./pages/Callback";
import { SidebarProvider } from "./components/ui/sidebar";
import SessionProvider from "./providers/SessionProvider";
import Auth from "./pages/Auth";
import { Toaster } from "sonner";

const App = () => {
  return (
    <SessionProvider>
      <Toaster position="top-center" theme="dark" />
      <SidebarProvider>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Auth />} path="/auth" />
          <Route element={<Home />} path="/chat/:id" />
          <Route element={<Terms />} path="/terms" />
          <Route element={<Policy />} path="/privacy" />
          <Route element={<AuthCallback />} path="/auth/callback" />
        </Routes>
      </SidebarProvider>
    </SessionProvider>
  );
};

export default App;
