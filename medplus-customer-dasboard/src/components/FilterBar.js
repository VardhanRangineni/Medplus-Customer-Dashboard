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
  onManagerChange
}) => {
  return (
    <div className="filter-bar mb-4 p-3 bg-white rounded shadow-sm">
      <Row className="g-3">
        <h5 className="d-flex align-items-center gap-2">
          <i className="bi bi-funnel"></i> Filters
        </h5>
        <Col md={3}>
          <Form.Group controlId="filterState">
            <Form.Label className="small text-muted fw-bold">State</Form.Label>
            <Form.Select
              size="sm"
              value={selectedState}
              onChange={(e) => onStateChange(e.target.value)}
              className="border-0 bg-light"
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
            <Form.Label className="small text-muted fw-bold">Area</Form.Label>
            <Form.Select
              size="sm"
              value={selectedArea}
              onChange={(e) => onAreaChange(e.target.value)}
              disabled={!selectedState}
              className="border-0 bg-light"
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
            <Form.Label className="small text-muted fw-bold">Supervisor</Form.Label>
            <Form.Select
              size="sm"
              value={selectedSupervisor}
              onChange={(e) => onSupervisorChange(e.target.value)}
              disabled={!selectedState || supervisors.length === 0}
              className="border-0 bg-light"
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
            <Form.Label className="small text-muted fw-bold">Manager</Form.Label>
            <Form.Select
              size="sm"
              value={selectedManager}
              onChange={(e) => onManagerChange(e.target.value)}
              disabled={!selectedState || managers.length === 0}
              className="border-0 bg-light"
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
  );
};

export default FilterBar;
