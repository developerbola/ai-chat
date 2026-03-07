import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Terms from "./pages/Terms";
import Policy from "./pages/Policy";
import AuthCallback from "./pages/Callback";

const App = () => {
  return (
    <div>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<Home />} path="/chat/:id" />
        <Route element={<Terms />} path="/terms" />
        <Route element={<Policy />} path="/policy" />
        <Route element={<AuthCallback />} path="/auth/callback" />
      </Routes>
    </div>
  );
};

export default App;
