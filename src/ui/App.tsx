import React from "react";
import * as Sentry from "@sentry/react";

import Search from "./views/Search";
import Selection from './views/Selection';
import ErrorFallback from "./components/ErrorFallback";

import { PluginMessageProvider} from './context/PluginMessages';
import { Routes, Route } from "react-router-dom";
import "../../node_modules/figma-plugin-ds/dist/figma-plugin-ds.css";
import "./App.css";

import Navbar from "./components/Navbar";
function App() {
  return (
    <main>
      <Sentry.ErrorBoundary fallback={ErrorFallback}>
        <PluginMessageProvider>
          <Navbar />
          <Routes>
            <Route index path="/" element={<Selection />} />
            <Route index path="/search" element={<Search />} />
            <Route path="*" element={<Selection />} />
          </Routes>
        </PluginMessageProvider>
      </Sentry.ErrorBoundary>
    </main>
  )
}

export default App;
