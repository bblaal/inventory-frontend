import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import InventoryPage from "./pages/InventoryPage";
import ToBuyPage from "./pages/ToBuyPage";
import "./styles/main.css";

export default function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Main Page Content */}
        <div className="page-content">
          <Routes>
            <Route path="/" element={<InventoryPage />} />
            <Route path="/tobuy" element={<ToBuyPage />} />
          </Routes>
        </div>

        {/* Bottom Navigation Bar */}
        <nav className="bottom-nav">
          {/* <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            🏠 <span>Home</span>
          </NavLink> */}

          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            📦 <span>Inventory</span>
          </NavLink>

          <NavLink
            to="/tobuy"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            🛒 <span>To Buy</span>
          </NavLink>
        </nav>
      </div>
    </Router>
  );
}
