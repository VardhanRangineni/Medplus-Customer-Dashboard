import React from 'react';

const Header = () => {
  return (
    <header className="app-header">
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
