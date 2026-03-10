import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Terms from "./pages/Terms";
import Policy from "./pages/Policy";
import AuthCallback from "./pages/Callback";
import { SidebarProvider } from "./components/ui/sidebar";
import SessionProvider from "./providers/SessionProvider";
import Auth from "./pages/Auth";

const App = () => {
  return (
    <SessionProvider>
      <SidebarProvider>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Auth />} path="/auth" />
          <Route element={<Home />} path="/chat/:id" />
          <Route element={<Terms />} path="/terms" />
          <Route element={<Policy />} path="/policy" />
          <Route element={<AuthCallback />} path="/auth/callback" />
        </Routes>
      </SidebarProvider>
    </SessionProvider>
  );
};

export default App;
