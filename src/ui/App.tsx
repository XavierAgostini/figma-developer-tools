import React from "react";
import Selection from './views/Selection';
import { PluginMessageProvider} from './context/PluginMessages';
import { Routes, Route } from "react-router-dom";
import "../../node_modules/figma-plugin-ds/dist/figma-plugin-ds.css";
import "./App.css";

import Navbar from "./components/Navbar";
function App() {
  return (
    <main>
      <PluginMessageProvider>
        <Navbar />
        <Routes>
          <Route index path="/" element={<Selection />} />
          <Route path="*" element={<Selection />} />
        </Routes>
      </PluginMessageProvider>
    </main>
  )
}

export default App;
