import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import InventoryPage from "./pages/InventoryPage";
import ToBuyPage from "./pages/ToBuyPage";
import { LoadingProvider, LoadingContext } from "./context/LoadingContext";
import GlobalLoader from "./components/GlobalLoader";
import { loader } from "./api/loaderManager";
import "./styles/main.css";

function AppContent() {
  const { setLoading } = useContext(LoadingContext);

  // Register loader setter
  useEffect(() => {
    loader.register(setLoading);
  }, [setLoading]);

  return (
    <>
      <GlobalLoader />

      <div className="app-container">
        <div className="page-content">
          <Routes>
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/" element={<ToBuyPage />} />
          </Routes>
        </div>

        <nav className="bottom-nav">
          <NavLink to="/inventory" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            📦 <span>Inventory</span>
          </NavLink>

          <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            🛒 <span>To Buy</span>
          </NavLink>
        </nav>
      </div>
    </>
  );
}

export default function App() {
  return (
    <LoadingProvider>
      <Router>
        <AppContent />
      </Router>
    </LoadingProvider>
  );
}
