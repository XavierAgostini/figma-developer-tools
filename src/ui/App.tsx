import React, { useRef } from "react";
import Selection from './views/Selection';
import Settings from './views/Settings';
import Search from './views/Search';

import { Routes, Route } from "react-router-dom";

import "./App.css";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route index path="/" element={<Selection />} />
        <Route path="/Search" element={<Search />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Selection />} />
      </Routes>
    </div>
  )
}

export default App;
