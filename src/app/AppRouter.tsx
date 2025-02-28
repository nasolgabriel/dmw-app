"use client";

import LoginPageBlock from "@/app/(auth)/login/loginPageBlock";
import QueueDisplay from "@/app/public/queueDisplay/queueDisplay";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import WindowViewBlock from "./protected/windowView/windowViewBlock";

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
