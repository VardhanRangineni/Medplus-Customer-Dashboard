import React from 'react';
import { FaBars } from 'react-icons/fa';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="app-header">
      <div className="d-md-none me-3" onClick={toggleSidebar} style={{ cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-secondary)' }}>
        <FaBars />
      </div>
      <div className="logo-area">
        <span style={{ color: 'var(--danger-color)', fontWeight: '800' }}>MedPlus</span>
        <span style={{ color: 'var(--success-color)' }}>+</span>
      </div>
      <div className="header-title">
        Customer Dashboard
      </div>
    </header>
  );
};

export default Header;
