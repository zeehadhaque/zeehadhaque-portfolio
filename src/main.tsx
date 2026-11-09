import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/theme.css";
import "./styles/trackside-cinema.css";
import "./styles/academy.css";
import "./styles/cinematic-motion.css";
import "./styles/ui-refresh.css";
import "./styles/three-d-world.css";
import "./styles/every-element-motion.css";
import "./styles/complete-motion-system.css";
import "./styles/premium-cinematic-finish.css";
import "./styles/auteur-cinematic-overhaul.css";
import "./styles/cinematic-luxury-finish.css";
import "./styles/infinite-cinematic-experience.css";
import "./styles/performance-safety.css";
import { App } from "./app/App";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Application root was not found.");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
