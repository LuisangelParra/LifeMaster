import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Knowledge from './pages/Knowledge';
import Quests from './pages/Quests';
import Focus from './pages/Focus';
import Tasks from './pages/Tasks';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="knowledge" element={<Knowledge />} />
            <Route path="notes" element={<Knowledge />} />
            <Route path="quests" element={<Quests />} />
            <Route path="focus" element={<Focus />} />
            <Route path="tasks" element={<Tasks />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;