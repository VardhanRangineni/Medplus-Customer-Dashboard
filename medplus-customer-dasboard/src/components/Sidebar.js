import React from 'react';
import { FaChartPie, FaFileInvoiceDollar, FaChartLine, FaUsers } from 'react-icons/fa';

const Sidebar = ({ activeSection, scrollToSection }) => {
    return (
        <div className="sidebar-container">
            <div
                className={`nav-item ${activeSection === 'section1' ? 'active' : ''}`}
                onClick={() => scrollToSection('section1')}
                title="KPIs & Segmentation"
            >
                <FaChartPie />
            </div>
            <div
                className={`nav-item ${activeSection === 'section2' ? 'active' : ''}`}
                onClick={() => scrollToSection('section2')}
                title="Sales & Invoice Analytics"
            >
                <FaFileInvoiceDollar />
            </div>
            <div
                className={`nav-item ${activeSection === 'section3' ? 'active' : ''}`}
                onClick={() => scrollToSection('section3')}
                title="Trend Panel"
            >
                <FaChartLine />
            </div>
            <div
                className={`nav-item ${activeSection === 'section4' ? 'active' : ''}`}
                onClick={() => scrollToSection('section4')}
                title="Customer Retention"
            >
                <FaUsers />
            </div>
        </div>
    );
};

export default Sidebar;
