import React from 'react';
import { Row, Col, Dropdown } from 'react-bootstrap';

const FilterBar = ({
  states = [],
  areas = [],
  supervisors = [],
  managers = [],
  selectedState,
  selectedArea,
  selectedSupervisor,
  selectedManager,
  onStateChange,
  onAreaChange,
  onSupervisorChange,
  onManagerChange,
  isOpen,
  toggleFilters
}) => {
  const containerStyle = {
    backgroundColor: 'var(--surface-color)',
    borderRadius: 'var(--border-radius-lg)',
    boxShadow: 'var(--card-shadow)',
    border: '1px solid transparent',
    marginBottom: '1.5rem',
    padding: '1.5rem'
  };

  const labelStyle = {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'block'
  };

  const CustomDropdown = ({ label, value, options, onSelect, placeholder, disabled, valueKey = 'value', labelKey = 'label' }) => {
    // Helper to find label for current value
    const currentLabel = options.find(opt => {
      const optVal = typeof opt === 'object' ? opt[valueKey] : opt;
      return optVal === value;
    });

    const displayValue = currentLabel
      ? (typeof currentLabel === 'object' ? currentLabel[labelKey] : currentLabel)
      : placeholder;

    return (
      <div className="custom-dropdown">
        <label style={labelStyle}>{label}</label>
        <Dropdown onSelect={onSelect}>
          <Dropdown.Toggle disabled={disabled} variant="light" className="w-100 justify-content-between align-items-center d-flex">
            {value ? displayValue : placeholder}
          </Dropdown.Toggle>
          <Dropdown.Menu className="w-100">
            <Dropdown.Item eventKey="">{placeholder}</Dropdown.Item>
            {options.map((opt, idx) => {
              const optVal = typeof opt === 'object' ? opt[valueKey] : opt;
              const optLabel = typeof opt === 'object' ? opt[labelKey] : opt;
              return (
                <Dropdown.Item key={idx} eventKey={optVal} active={value === optVal}>
                  {optLabel}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="d-flex align-items-center gap-2 m-0" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '600', color: 'var(--text-primary)' }}>
          <i className="bi bi-funnel-fill" style={{ color: 'var(--primary-color)' }}></i> Filters
        </h5>
        <button className="btn btn-sm btn-outline-primary d-md-none" onClick={toggleFilters}>
          {isOpen ? 'Hide' : 'Show'}
        </button>
      </div>
      <div className={`${isOpen ? 'd-block' : 'd-none d-md-block'}`}>
        <Row className="g-3">
          <Col md={3}>
            <CustomDropdown
              label="State"
              value={selectedState}
              options={states}
              onSelect={onStateChange}
              placeholder="Select State"
            />
          </Col>
          <Col md={3}>
            <CustomDropdown
              label="Area"
              value={selectedArea}
              options={areas}
              onSelect={onAreaChange}
              placeholder="Select Area"
              disabled={!selectedState}
            />
          </Col>
          <Col md={3}>
            <CustomDropdown
              label="Supervisor"
              value={selectedSupervisor}
              options={supervisors}
              onSelect={onSupervisorChange}
              placeholder="All Supervisors"
              disabled={!selectedState || supervisors.length === 0}
              valueKey="id"
              labelKey="label"
            />
          </Col>
          <Col md={3}>
            <CustomDropdown
              label="Manager"
              value={selectedManager}
              options={managers}
              onSelect={onManagerChange}
              placeholder="All Managers"
              disabled={!selectedState || managers.length === 0}
              valueKey="id"
              labelKey="label"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default FilterBar;
