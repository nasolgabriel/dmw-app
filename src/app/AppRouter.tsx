// src/app/AppRouter.tsx
'use client';

import QueueDisplay from '@/components/queueDisplay/queueDisplay';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const Home: React.FC = () => (
  <div>
    <h1>Home</h1>
    <nav>
      <Link to="/queue-display">Go to Queue Display</Link>
    </nav>
  </div>
);

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/queue-display" element={<QueueDisplay />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
