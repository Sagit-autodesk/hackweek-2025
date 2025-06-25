import { HashRouter, Routes, Route } from "react-router-dom";
import InputPage from "./pages/InputPage";
import SuccessPage from "./pages/SuccessPage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<InputPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </HashRouter>
  );
}
