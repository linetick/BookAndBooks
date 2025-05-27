import React from "react";
import { Outlet } from "react-router-dom";
import { NavigationMenu } from "./index";

const Layout = () => {
  return (
    <div>
      <NavigationMenu />
      <div style={{ marginLeft: 56, marginTop: 0, transition: 'margin-left 0.2s cubic-bezier(.4,0,.2,1)' }}>
        <main style={{ minHeight: '60vh' }}>
          <Outlet />
        </main>
        <footer style={{ 
          background: 'var(--card-bg)', 
          color: 'var(--text-primary)',
          padding: 10, 
          textAlign: 'center',
          transition: 'background-color 0.3s ease, color 0.3s ease'
        }}>
          <p>2025 Архиреев А.В. Михайлова К.Ю.</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout; 