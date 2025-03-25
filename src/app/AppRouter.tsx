"use client";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPageBlock from "@/app/(auth)/login/loginPageBlock";
import WindowViewBlock from "./protected/windowView/windowViewBlock";
import FirstStepViewBlock from "./protected/firstStepView/firstStepViewBlock";
import ProtectedRoute from "@/components/protectedRoute/ProtectedRoute";
import QueueDisplayBlock from "./public/queueDisplay/queueDisplayBlock";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPageBlock />} />
        <Route path="/queue-display" element={<QueueDisplayBlock />} />
        <Route
          path="/window-view"
          element={
            <ProtectedRoute requiredRole="windows">
              <WindowViewBlock />
            </ProtectedRoute>
          }
        />
        <Route
          path="/first-step-view"
          element={
            <ProtectedRoute requiredRole="firststep">
              <FirstStepViewBlock />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
