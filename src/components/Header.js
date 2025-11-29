import React from 'react';
import { FaBars } from 'react-icons/fa';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="app-header">
      <div className="d-md-none me-3" onClick={toggleSidebar} style={{ cursor: 'pointer', fontSize: '1.5rem', color: '#6c757d' }}>
        <FaBars />
      </div>
      <div className="logo-area">
        <span style={{ color: '#ff0000', fontWeight: '900' }}>MedPlus</span>
        <span style={{ color: '#1c7905ff' }}>+</span>
      </div>
      <div className="header-title">
        Customer Dashboard
      </div>
    </header>
  );
};

export default Header;
