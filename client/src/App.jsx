import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Terms from "./pages/Terms";
import Policy from "./pages/Policy";

const App = () => {
  return (
    <div>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<Terms />} path="/terms" />
        <Route element={<Policy />} path="/policy" />
      </Routes>
    </div>
  );
};

export default App;
