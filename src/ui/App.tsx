import React, { useRef } from "react";
import Selection from './views/Selection';
import Settings from './views/Settings';
import Search from './views/Search';

import { Routes, Route, useLocation } from "react-router-dom";

import "./App.css";
import Navbar from "./components/Navbar";

function App() {
  const location = useLocation()
  console.log("location", location)
  // navigate.apply()
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
