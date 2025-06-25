import { HashRouter, Routes, Route } from "react-router-dom";
import FormPage from "./pages/FormPage";
import SuccessPage from "./pages/SuccessPage";

export default function SidebarApp() {
  return (
    <div
      style={{
        width: 400,
        height: "100vh",
        background: "linear-gradient(135deg, #f9fafb 0%, #f0f9ff 100%)",
        padding: 0,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          background: "linear-gradient(135deg, rgba(14, 165, 233, 0.03) 0%, rgba(3, 105, 161, 0.05) 100%)",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <HashRouter>
          <Routes>
            <Route path="/" element={<FormPage />} />
            <Route path="/success" element={<SuccessPage />} />
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
}
