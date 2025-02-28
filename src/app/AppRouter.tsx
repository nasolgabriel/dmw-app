"use client";

import LoginPage from "@/components/login/loginPage";
import LoginPageBlock from "@/components/login/loginPageBlock";
import QueueDisplay from "@/components/queueDisplay/queueDisplay";
import WindowViewBlock from "@/components/windowView/windowViewBlock";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPageBlock />} />
        <Route path="/window-view" element={<WindowViewBlock />} />
        <Route path="/queue-display" element={<QueueDisplay />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
