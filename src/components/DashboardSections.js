import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Row, Col, Table } from 'react-bootstrap';
import 'chart.js/auto';
import { Bar, Pie, Line } from 'react-chartjs-2';


const DashboardSections = ({ data, selectedState }) => {
    const revenueCardRef = useRef(null);

    useEffect(() => {
        if (selectedState === 'Telangana' && revenueCardRef.current) {
            const rect = revenueCardRef.current.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { x, y }
            });
        }
    }, [selectedState]);
    if (!data) return <div className="p-5 text-center">Loading data...</div>;

    const { kpis, customerSegmentation, salesInvoiceAnalytics, trendPanel, customerRetention } = data;

    // --- Chart Options ---
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: { family: 'Inter', size: 12 },
                    color: '#64748b' // Slate 500
                }
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)', // Slate 900
                titleFont: { family: 'Outfit', size: 13 },
                bodyFont: { family: 'Inter', size: 12 },
                padding: 10,
                cornerRadius: 8,
                displayColors: true
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { family: 'Inter', size: 11 }, color: '#94a3b8' }
            },
            y: {
                grid: { borderDash: [5, 5], color: '#e2e8f0' },
                ticks: { font: { family: 'Inter', size: 11 }, color: '#94a3b8' }
            }
        }
    };

    const horizontalOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: { family: 'Inter', size: 12 },
                    color: '#64748b'
                }
            },
            title: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleFont: { family: 'Outfit', size: 13 },
                bodyFont: { family: 'Inter', size: 12 },
                padding: 10,
                cornerRadius: 8
            }
        },
        scales: {
            x: {
                grid: { borderDash: [5, 5], color: '#e2e8f0' },
                ticks: { font: { family: 'Inter', size: 11 }, color: '#94a3b8' }
            },
            y: {
                grid: { display: false },
                ticks: { font: { family: 'Inter', size: 11 }, color: '#94a3b8' }
            }
        }
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    usePointStyle: true,
                    font: { family: 'Inter', size: 12 },
                    color: '#64748b',
                    padding: 15
                }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                bodyFont: { family: 'Inter', size: 12 },
                padding: 10,
                cornerRadius: 8
            }
        },
        elements: {
            arc: {
                borderWidth: 2,
                borderColor: '#ffffff'
            }
        }
    };

    // --- Data Preparation ---

    // Colors
    const colors = {
        primary: '#4f46e5', // Indigo 600
        secondary: '#818cf8', // Indigo 400
        success: '#10b981', // Emerald 500
        warning: '#f59e0b', // Amber 500
        danger: '#ef4444', // Red 500
        info: '#06b6d4', // Cyan 500
        purple: '#7c3aed', // Violet 600
        slate: '#64748b' // Slate 500
    };

    // Section 1: Customer Segmentation
    const purchaseValueData = {
        labels: customerSegmentation.byPurchaseValue.map(item => `${item.min}-${item.max || '+'}`),
        datasets: [{
            label: 'Customer Count',
            data: customerSegmentation.byPurchaseValue.map(item => item.customerCount),
            backgroundColor: colors.primary,
            borderRadius: 6,
            barThickness: 24,
        }],
    };

    const channelData = {
        labels: customerSegmentation.byChannel.map(item => item.label),
        datasets: [{
            data: customerSegmentation.byChannel.map(item => item.pct * 100),
            backgroundColor: [colors.primary, colors.success, colors.warning, colors.info, colors.danger],
            borderWidth: 2,
        }],
    };

    // Section 2: Sales & Invoice Analytics
    const revenueByChannelData = {
        labels: customerSegmentation.revenueByChannel.map(item => item.channelId),
        datasets: [{
            data: customerSegmentation.revenueByChannel.map(item => item.pct * 100),
            backgroundColor: [colors.primary, colors.purple, colors.success, colors.info, colors.danger],
            borderWidth: 2,
        }]
    };

    const revenueByTypeData = {
        labels: customerSegmentation.revenueByType.map(item => item.label),
        datasets: [{
            label: 'Revenue',
            data: customerSegmentation.revenueByType.map(item => item.revenue),
            backgroundColor: colors.success,
            borderRadius: 6,
            barThickness: 18,
        }]
    };

    const invoiceSlabData = {
        labels: salesInvoiceAnalytics.invoiceCountByPurchaseSlab.map(item => `${item.min}-${item.max || '+'}`),
        datasets: [{
            label: 'Invoice Count',
            data: salesInvoiceAnalytics.invoiceCountByPurchaseSlab.map(item => item.invoiceCount),
            backgroundColor: colors.primary,
            borderRadius: 6,
            barThickness: 24,
        }]
    };

    const avgInvoiceData = {
        labels: salesInvoiceAnalytics.averageInvoiceCount.map(item => item.period.toUpperCase()),
        datasets: [{
            label: 'Count',
            data: salesInvoiceAnalytics.averageInvoiceCount.map(item => item.count),
            backgroundColor: colors.secondary,
            borderRadius: 6,
            barThickness: 32,
        }]
    };

    // Section 3: Trend Panel
    const monthlyRevenueData = {
        labels: trendPanel.monthlyRevenue.map(item => item.month),
        datasets: [{
            label: 'Revenue',
            data: trendPanel.monthlyRevenue.map(item => item.revenue),
            borderColor: colors.primary,
            backgroundColor: 'rgba(79, 70, 229, 0.1)', // Indigo 600 with opacity
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: colors.primary,
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
        }]
    };

    const mauDauData = {
        labels: trendPanel.mauDauTrend.map(item => item.month),
        datasets: [
            {
                label: 'MAU',
                data: trendPanel.mauDauTrend.map(item => item.mau),
                borderColor: colors.purple,
                tension: 0.4,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: colors.purple,
                pointBorderWidth: 2
            },
            {
                label: 'DAU',
                data: trendPanel.mauDauTrend.map(item => item.dau),
                borderColor: colors.info,
                tension: 0.4,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: colors.info,
                pointBorderWidth: 2
            }
        ]
    };

    const newCustData = {
        labels: trendPanel.newCustomerAcquisition.map(item => item.month),
        datasets: [{
            label: 'New Customers',
            data: trendPanel.newCustomerAcquisition.map(item => item.count),
            borderColor: colors.success,
            tension: 0.4,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: colors.success,
            pointBorderWidth: 2
        }]
    };

    const churnData = {
        labels: trendPanel.customerChurnPct.map(item => item.month),
        datasets: [{
            label: 'Churn %',
            data: trendPanel.customerChurnPct.map(item => item.churnPct),
            borderColor: colors.danger,
            tension: 0.4,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: colors.danger,
            pointBorderWidth: 2
        }]
    };


    return (
        <div className="dashboard-sections">

            {/* Section 1: KPI & Segmentation */}
            <div id="section1" className="dashboard-section">
                <h4 className="section-title">KPIs & Customer Segmentation</h4>

                {/* KPI Cards */}
                <Row className="g-4 mb-4">
                    <Col md={3}>
                        <div className="kpi-card">
                            <div className="kpi-title">DAU / MAU Ratio</div>
                            <div className="kpi-value">{(kpis.dauMauRatio * 100).toFixed(1)}%</div>
                            <div className="kpi-subtext text-success">Target: &gt;25%</div>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="kpi-card">
                            <div className="kpi-title">Today's Active Users</div>
                            <div className="kpi-value">{kpis.todaysActiveUsers.toLocaleString()}</div>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="kpi-card" ref={revenueCardRef}>
                            <div className="kpi-title">Total Revenue</div>
                            <div className="kpi-value">₹{(kpis.revenue / 10000000).toFixed(1)}Cr</div>
                            <div className="kpi-subtext">Invoices: {kpis.invoices.toLocaleString()}</div>
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="kpi-card">
                            <div className="kpi-title">MTD Pharma Plans</div>
                            <div className="kpi-value">{kpis.mtdMaPharmaPlansSold.toLocaleString()}</div>
                        </div>
                    </Col>
                </Row>

                <Row className="g-4">
                    <Col md={4}>
                        <div className="chart-container">
                            <div className="chart-title">Customer Split by Purchase Value</div>
                            <div style={{ height: '250px' }}>
                                <Bar data={purchaseValueData} options={horizontalOptions} />
                            </div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="chart-container">
                            <div className="chart-title">Customer Split by Channel</div>
                            <div style={{ height: '250px' }}>
                                <Pie data={channelData} options={pieOptions} />
                            </div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="chart-container">
                            <div className="chart-title">Top Customers</div>
                            <div style={{ height: '250px', overflowY: 'auto' }}>
                                <Table hover size="sm" className="custom-table">
                                    <thead>
                                        <tr>
                                            <th>Customer</th>
                                            <th className="text-end">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customerSegmentation.topCustomers.map(cust => (
                                            <tr key={cust.customerId}>
                                                <td>{cust.name}</td>
                                                <td className="text-end">{cust.purchaseValue.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Section 2: Sales & Invoice Analytics */}
            <div id="section2" className="dashboard-section">
                <h4 className="section-title">Sales & Invoice Analytics</h4>
                <Row className="g-4">
                    <Col md={6}>
                        <div className="chart-container">
                            <div className="chart-title">Revenue Split by Channel</div>
                            <div style={{ height: '300px' }}>
                                <Pie data={revenueByChannelData} options={pieOptions} />
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="chart-container">
                            <div className="chart-title">Revenue Split by Type</div>
                            <div style={{ height: '300px' }}>
                                <Bar data={revenueByTypeData} options={horizontalOptions} />
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="chart-container">
                            <div className="chart-title">Invoice Split by Purchase Slab</div>
                            <div style={{ height: '300px' }}>
                                <Bar data={invoiceSlabData} options={horizontalOptions} />
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="chart-container">
                            <div className="chart-title">Average Invoice Count</div>
                            <div style={{ height: '300px' }}>
                                <Bar data={avgInvoiceData} options={horizontalOptions} />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Section 3: Trend Panel */}
            <div id="section3" className="dashboard-section">
                <h4 className="section-title">Trend Panel</h4>
                <Row className="g-4">
                    <Col md={6}>
                        <div className="chart-container">
                            <div className="chart-title">Monthly Revenue Trend</div>
                            <div style={{ height: '250px' }}>
                                <Line data={monthlyRevenueData} options={commonOptions} />
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="chart-container">
                            <div className="chart-title">MAU & DAU Trends</div>
                            <div style={{ height: '250px' }}>
                                <Line data={mauDauData} options={commonOptions} />
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="chart-container">
                            <div className="chart-title">New Customer Acquisition</div>
                            <div style={{ height: '250px' }}>
                                <Line data={newCustData} options={commonOptions} />
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="chart-container">
                            <div className="chart-title">Customer Churn %</div>
                            <div style={{ height: '250px' }}>
                                <Line data={churnData} options={commonOptions} />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Section 4: Customer Retention */}
            <div id="section4" className="dashboard-section">
                <h4 className="section-title">Customer Retention</h4>
                <div className="chart-container">
                    <div className="chart-title">Cohort Analysis (Retention %)</div>
                    <div className="table-responsive">
                        <Table bordered size="sm" style={{ fontSize: '0.85rem', textAlign: 'center' }}>
                            <thead>
                                <tr>
                                    <th>Cohort</th>
                                    <th>M0</th>
                                    <th>M1</th>
                                    <th>M2</th>
                                    <th>M3</th>
                                    <th>M4</th>
                                    <th>M5</th>
                                    <th>M6</th>
                                    <th>M7</th>
                                    <th>M8</th>
                                    <th>M9</th>
                                    <th>M10</th>
                                    <th>M11</th>
                                    <th>M12</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Mocking full cohort table based on single entry in data.json for demo purposes, 
                                in a real app we would map over all cohorts */}
                                <tr>
                                    <td style={{ fontWeight: 'bold' }}>Jan-23</td>
                                    <td className="bg-success text-white" style={{ opacity: 1 }}>100%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}>14%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.5)' }}>50%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.4)' }}>39%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.4)' }}>40%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.5)' }}>47%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.3)' }}>33%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}>24%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.3)' }}>31%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>14%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.4)' }}>38%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.4)' }}>41%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>11%</td>
                                </tr>
                                <tr>
                                    <td style={{ fontWeight: 'bold' }}>Feb-23</td>
                                    <td className="bg-success text-white">100%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}>17%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}>15%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.3)' }}>30%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.3)' }}>31%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}>22%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.4)' }}>39%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}>20%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}>23%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>10%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}>16%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.5)' }}>45%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.3)' }}>27%</td>
                                </tr>
                                <tr>
                                    <td style={{ fontWeight: 'bold' }}>Mar-23</td>
                                    <td className="bg-success text-white">100%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.3)' }}>30%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.4)' }}>39%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.4)' }}>41%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.3)' }}>25%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.4)' }}>42%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.3)' }}>29%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}>17%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}>18%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.5)' }}>48%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.4)' }}>43%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}>19%</td>
                                    <td style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}>20%</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>

                <div className="chart-container mt-4">
                    <div className="chart-title">Customer Retention by Category</div>
                    <div className="table-responsive">
                        <Table bordered size="sm" style={{ fontSize: '0.85rem', textAlign: 'center' }}>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Customers</th>
                                    <th>Invoices</th>
                                    <th>Total</th>
                                    <th>P Br C</th>
                                    <th>P PL C</th>
                                    <th>P Br A</th>
                                    <th>P PL A</th>
                                    <th>N Br</th>
                                    <th>N PL</th>
                                    <th>SIP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customerRetention.volumeMetricsByRetentionMonth.map((row, index) => {
                                    const getRetentionField = (row, key) => {
                                        if (!row) return undefined;
                                        if (key in row) return row[key];
                                        // fallback to nested categoryRevenueSplit for category keys
                                        if (row.categoryRevenueSplit) {
                                            const map = {
                                                pBrC: 'P_BR_C', pPlC: 'P_PL_C', pBrA: 'P_BR_A', pPlA: 'P_PL_A', nBr: 'N_BR', nPl: 'N_PL', sip: 'SIP'
                                            };
                                            const mapKey = map[key];
                                            if (mapKey && row.categoryRevenueSplit[mapKey] !== undefined) return row.categoryRevenueSplit[mapKey];
                                        }
                                        // Try common aliases
                                        if (key === 'total' && row.totalRevenue !== undefined) return row.totalRevenue;
                                        return undefined;
                                    };

                                    const getCellStyle = (val) => {
                                        if (!val) return {};
                                        if (typeof val === 'string' && val.includes('%')) {
                                            const num = parseInt(val);
                                            // Simple opacity scale for green background
                                            const opacity = num / 100;
                                            return { backgroundColor: `rgba(16, 185, 129, ${opacity})` };
                                        }
                                        return {};
                                    };

                                    return (
                                        <tr key={index}>
                                            <td style={{ fontWeight: 'bold' }}>{row.retentionMonth}</td>
                                            <td>{getRetentionField(row, 'customers') || getRetentionField(row, 'customers') || ''}</td>
                                            <td style={getCellStyle(getRetentionField(row, 'invoices'))}>{getRetentionField(row, 'invoices') || ''}</td>
                                            <td style={getCellStyle(getRetentionField(row, 'total'))}>{getRetentionField(row, 'total') || ''}</td>
                                            <td style={getCellStyle(getRetentionField(row, 'pBrC'))}>{getRetentionField(row, 'pBrC') || ''}</td>
                                            <td style={getCellStyle(getRetentionField(row, 'pPlC'))}>{getRetentionField(row, 'pPlC') || ''}</td>
                                            <td style={getCellStyle(getRetentionField(row, 'pBrA'))}>{getRetentionField(row, 'pBrA') || ''}</td>
                                            <td style={getCellStyle(getRetentionField(row, 'pPlA'))}>{getRetentionField(row, 'pPlA') || ''}</td>
                                            <td style={getCellStyle(getRetentionField(row, 'nBr'))}>{getRetentionField(row, 'nBr') || ''}</td>
                                            <td style={getCellStyle(getRetentionField(row, 'nPl'))}>{getRetentionField(row, 'nPl') || ''}</td>
                                            <td style={getCellStyle(getRetentionField(row, 'sip'))}>{getRetentionField(row, 'sip') || ''}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DashboardSections;
