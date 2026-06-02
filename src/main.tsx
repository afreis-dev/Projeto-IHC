import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { AppProviders } from "./context/AppProviders";
import App from "./App";
import "./styles/global.css";
import "./styles/a11y.css";
import "./styles/components.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <AppProviders>
        <App />
      </AppProviders>
    </HashRouter>
  </React.StrictMode>
);
