import "./styles/tokens.css";
import "./styles/castle-universe.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { InboxApp } from "./app/InboxApp";

const root = document.getElementById("root");
if (!root) throw new Error("Application root was not found.");

const isInboxRoute = window.location.pathname.replace(/\/+$/, "") === "/inbox";

createRoot(root).render(
  <StrictMode>
    {isInboxRoute ? <InboxApp /> : <App />}
  </StrictMode>,
);
