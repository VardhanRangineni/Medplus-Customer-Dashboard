import React from 'react';
import { FaBars } from 'react-icons/fa';
import logo from '../Assets/medplus_logo@2x.png';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="app-header">
      <div className="d-md-none me-3" onClick={toggleSidebar} style={{ cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-secondary)' }}>
        <FaBars />
      </div>
      <div className="logo-area">
        <img src={logo} alt="MedPlus" height="42" style={{ objectFit: 'contain', borderRadius: '8px' }} />
      </div>
      <div className="header-title">
        Customer Dashboard
      </div>
    </header>
  );
};

export default Header;
