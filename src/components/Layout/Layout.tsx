import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useApp } from '../../context/AppContext';

const Layout = () => {
  const { state } = useApp();

  return (
    <div className={`flex min-h-screen ${state.theme === 'dark' ? 'dark' : ''}`}>
      <Sidebar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;