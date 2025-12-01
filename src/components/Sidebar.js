import React from 'react';
import { FaChartPie, FaFileInvoiceDollar, FaChartLine, FaUsers } from 'react-icons/fa';

const Sidebar = ({ activeSection, scrollToSection, isOpen, toggleSidebar }) => {
    return (
        <>
            <div
                className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
                onClick={toggleSidebar}
            />
            <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
                <div
                    className={`nav-item ${activeSection === 'section1' ? 'active' : ''}`}
                    onClick={() => scrollToSection('section1')}
                >
                    <FaChartPie />
                    <span>KPIs & Segmentation</span>
                </div>
                <div
                    className={`nav-item ${activeSection === 'section2' ? 'active' : ''}`}
                    onClick={() => scrollToSection('section2')}
                >
                    <FaFileInvoiceDollar />
                    <span>Sales & Invoices</span>
                </div>
                <div
                    className={`nav-item ${activeSection === 'section3' ? 'active' : ''}`}
                    onClick={() => scrollToSection('section3')}
                >
                    <FaChartLine />
                    <span>Trend Analysis</span>
                </div>
                <div
                    className={`nav-item ${activeSection === 'section4' ? 'active' : ''}`}
                    onClick={() => scrollToSection('section4')}
                >
                    <FaUsers />
                    <span>Customer Retention</span>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
