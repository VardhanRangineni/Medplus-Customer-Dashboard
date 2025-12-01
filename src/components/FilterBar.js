import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

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
    border: '1px solid transparent', // Ready for potential border color
    marginBottom: '1.5rem',
    padding: '1.5rem'
  };

  const labelStyle = {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const selectStyle = {
    backgroundColor: '#f8fafc', // Slate 50
    border: '1px solid #e2e8f0', // Slate 200
    borderRadius: 'var(--border-radius-sm)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    padding: '0.5rem 0.75rem',
    boxShadow: 'none'
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
            <Form.Group controlId="filterState">
              <Form.Label style={labelStyle}>State</Form.Label>
              <Form.Select
                size="sm"
                value={selectedState}
                onChange={(e) => onStateChange(e.target.value)}
                style={selectStyle}
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="filterArea">
              <Form.Label style={labelStyle}>Area</Form.Label>
              <Form.Select
                size="sm"
                value={selectedArea}
                onChange={(e) => onAreaChange(e.target.value)}
                disabled={!selectedState}
                style={selectStyle}
              >
                <option value="">Select Area</option>
                {areas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="filterSupervisor">
              <Form.Label style={labelStyle}>Supervisor</Form.Label>
              <Form.Select
                size="sm"
                value={selectedSupervisor}
                onChange={(e) => onSupervisorChange(e.target.value)}
                disabled={!selectedState || supervisors.length === 0}
                style={selectStyle}
              >
                <option value="">All Supervisors</option>
                {supervisors.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="filterManager">
              <Form.Label style={labelStyle}>Manager</Form.Label>
              <Form.Select
                size="sm"
                value={selectedManager}
                onChange={(e) => onManagerChange(e.target.value)}
                disabled={!selectedState || managers.length === 0}
                style={selectStyle}
              >
                <option value="">All Managers</option>
                {managers.map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default FilterBar;
