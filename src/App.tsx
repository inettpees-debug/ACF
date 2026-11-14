import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import SiteNav from "./components/SiteNav";
import SiteFooter from "./components/SiteFooter";
import Home from "./pages/Home";
import Task1 from "./pages/Task1";
import Task2 from "./pages/Task2";
import Task3 from "./pages/Task3";
import Stata from "./pages/Stata";

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <SiteNav />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/task-1" element={<Task1 />} />
          <Route path="/task-2" element={<Task2 />} />
          <Route path="/task-3" element={<Task3 />} />
          <Route path="/stata" element={<Stata />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <SiteFooter />
    </>
  );
}
