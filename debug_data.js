const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'Assets', 'dashboard_by_state_area_download.json');

try {
    console.log('Reading file from:', dataPath);
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    const states = Object.keys(data);
    console.log('States found:', states);

    if (states.length === 0) {
        console.log('No states found in data.');
        process.exit(1);
    }

    const firstState = states[0];
    console.log('Testing aggregation for state:', firstState);

    const stateData = data[firstState];
    const areas = Object.values(stateData);
    console.log('Number of areas in ' + firstState + ':', areas.length);

    if (areas.length === 0) {
        console.log('No areas found for state.');
        process.exit(1);
    }

    // Simulate Aggregation Logic
    let totalRevenue = 0;
    let totalInvoices = 0;

    areas.forEach(area => {
        if (area.kpis) {
            totalRevenue += area.kpis.revenue || 0;
            totalInvoices += area.kpis.invoices || 0;
        }
    });

    console.log('Aggregated Total Revenue:', totalRevenue);
    console.log('Aggregated Total Invoices:', totalInvoices);

    // Check if the structure matches what we expect
    console.log('Sample Area Keys:', Object.keys(areas[0]));
    if (areas[0].kpis) {
        console.log('Sample KPI Keys:', Object.keys(areas[0].kpis));
    } else {
        console.log('KPIs missing in first area');
    }

} catch (err) {
    console.error('Error reading or parsing data:', err);
}
