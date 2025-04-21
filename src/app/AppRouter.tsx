"use client";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPageBlock from "@/app/(auth)/login/loginPageBlock";
import WindowViewBlock from "./protected/windowView/windowViewBlock";
import FirstStepViewBlock from "./protected/firstStepView/firstStepViewBlock";
import ProtectedRoute from "@/components/protectedRoute/ProtectedRoute";
import QueueDisplayBlock from "./public/queueDisplay/WindowsDisplay/queueDisplayBlock";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable refetching on window focus
      staleTime: 1000 * 60 * 5, // 5 minutes for all queries
    },
  },
});

const AppRouter: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}> {/* Wrap with provider */}
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
    </QueryClientProvider>
  );
};

export default AppRouter;