import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import MarkdownGuide from "@/pages/MarkdownGuide";
import { useSettingsStore } from "@/store/settingsStore";

export default function App() {
  const { applySettings } = useSettingsStore();

  // 应用启动时初始化设置
  useEffect(() => {
    applySettings();
  }, [applySettings]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/markdown-guide" element={<MarkdownGuide />} />
      </Routes>
    </Router>
  );
}
