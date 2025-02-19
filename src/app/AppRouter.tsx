// src/app/AppRouter.tsx
'use client';

import LoginPage from '@/components/login/loginPage';
import QueueDisplay from '@/components/queueDisplay/queueDisplay';
import WindowView from '@/components/windowView/windowView';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WindowView/>} />
        <Route path="/queue-display" element={<QueueDisplay />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
