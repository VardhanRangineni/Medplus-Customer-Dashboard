import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const FilterBar = ({
    states = [],
    areas = [],
    selectedState,
    selectedArea,
    onStateChange,
    onAreaChange
}) => {
    return (
        <div className="filter-bar mb-4 p-3 bg-white rounded shadow-sm">
            <Row className="g-3">
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
                        <Form.Select size="sm" disabled className="border-0 bg-light">
                            <option>All Supervisors</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group controlId="filterManager">
                        <Form.Label className="small text-muted fw-bold">Manager</Form.Label>
                        <Form.Select size="sm" disabled className="border-0 bg-light">
                            <option>All Managers</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
        </div>
    );
};

export default FilterBar;
