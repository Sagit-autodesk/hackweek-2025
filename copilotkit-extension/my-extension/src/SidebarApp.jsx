import { HashRouter, Routes, Route } from "react-router-dom";
import FormPage from "./pages/FormPage";
import SuccessPage from "./pages/SuccessPage";

export default function SidebarApp() {
  return (
    <div
      style={{
        width: 400,
        height: "100vh",
        background: "#f0f0f0",
        padding: 12,
        fontFamily: "sans-serif",
        boxSizing: "border-box",
      }}
    >
      <HashRouter>
        <Routes>
          <Route path="/" element={<FormPage />} />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </HashRouter>
    </div>
  );
}
