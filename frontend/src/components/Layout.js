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
        <footer style={{ background: '#f5f5f5', padding: 10, textAlign: 'center' }}>
          <p>© 2024 BookAndBooks</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout; 