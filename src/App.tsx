import { Route, Routes, Link } from "react-router-dom";
import { useState } from "react";
import {
  Github
} from "lucide-react";
import { motion } from "framer-motion";

import { SearchBar } from "./components/SearchBar";
import { GDPRBanner } from "./components/GDPRBanner";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import Bbase2 from "./pages/bbase2";


export default function App() {
  return (
    <>
      <GDPRBanner />
      <Routes>
        <Route path="/" element={<Bbase2 />} />
        <Route path="*" element={<Bbase2 />} />
      </Routes>
    </>
  );
}
