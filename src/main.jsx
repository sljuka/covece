import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, Navigate } from "react-router";
import Deck from "./Deck.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/:n" element={<Deck />} />
        <Route path="*" element={<Navigate to="/1" replace />} />
      </Routes>
    </HashRouter>
  </StrictMode>
);
