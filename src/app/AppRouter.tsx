// src/app/AppRouter.tsx
'use client';

import QueueDisplayBlock from '@/components/queueDisplay/queueDisplayBlock';
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
        <Route path="/queue-display" element={<QueueDisplayBlock />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
