import React from "react";
import ReactDOM from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import * as Sentry from "@sentry/react";

import App from "./App";

console.log('hi', import.meta.env)
Sentry.init({
  dsn: `${import.meta.env.VITE_SENTRY_DSN}`,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<MemoryRouter><App /></MemoryRouter>, );
