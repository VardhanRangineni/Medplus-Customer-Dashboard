const { aggregateStateData, aggregateAreas, getFilteredAreas } = require('./dataAggregator');
const data = require('../Assets/Data - 2.0.json');

console.log('States count:', Object.keys(data).length);

const state = 'Andhra Pradesh';
const area = 'AMALAPURAM';
const supervisor = 'Rina Singh';
const manager = 'Rohit Prasad';

const filtered = getFilteredAreas(data, state, area, '', '');
console.log('Filtered by state+area count:', filtered.length);
console.log('Example filtered area keys:', Object.keys(filtered[0] || {}).slice(0, 10));

const supFiltered = getFilteredAreas(data, state, '', supervisor, '');
console.log('Filtered by state+supervisor count:', supFiltered.length);
console.log('Example supFiltered first area cohorts count:', (supFiltered[0]?.customerRetention?.cohorts || []).length);

const mgrFiltered = getFilteredAreas(data, state, '', '', manager);
console.log('Filtered by state+manager count:', mgrFiltered.length);
console.log('Example mgrFiltered first area cohorts count:', (mgrFiltered[0]?.customerRetention?.cohorts || []).length);

const aggregatedSup = aggregateAreas(supFiltered, `${state} - ${supervisor} (Supervisor)`);
console.log('Aggregated Supervisor KPI (invoices):', aggregatedSup?.kpis?.invoices || 'N/A');
console.log('Supervisor retention rows:', aggregatedSup?.customerRetention?.volumeMetricsByRetentionMonth?.length || 0);
console.log(aggregatedSup?.customerRetention?.volumeMetricsByRetentionMonth?.slice(0,5));

const aggregatedMgr = aggregateAreas(mgrFiltered, `${state} - ${manager} (Manager)`);
console.log('Aggregated Manager KPI (invoices):', aggregatedMgr?.kpis?.invoices || 'N/A');
console.log('Manager retention rows:', aggregatedMgr?.customerRetention?.volumeMetricsByRetentionMonth?.length || 0);
console.log(aggregatedMgr?.customerRetention?.volumeMetricsByRetentionMonth?.slice(0,5));

const aggregatedArea = aggregateAreas(filtered, `${state} - ${area} (Area)`);
console.log('Aggregated Area KPI (invoices):', aggregatedArea?.kpis?.invoices || 'N/A');
console.log('Area retention rows:', aggregatedArea?.customerRetention?.volumeMetricsByRetentionMonth?.length || 0);
console.log(aggregatedArea?.customerRetention?.volumeMetricsByRetentionMonth?.slice(0,5));

const aggregatedState = aggregateStateData(state, data);
console.log('Aggregated state KPI (invoices):', aggregatedState?.kpis?.invoices || 'N/A');
console.log('Aggregated state retention rows:', aggregatedState?.customerRetention?.volumeMetricsByRetentionMonth?.length || 0);
console.log(aggregatedState?.customerRetention?.volumeMetricsByRetentionMonth?.slice(0,5));

// Also show computed supervisor/manager lists like in the app (ID + label pairs):
const supervisors = (() => {
	const areasForState = Object.values(data[state] || {});
	const map = new Map();
	areasForState.forEach(a => {
		const id = a.supervisorId || a.supervisor;
		const label = a.supervisor || a.supervisorId;
		if (id && label && !map.has(id)) map.set(id, { id, label });
	});
	return Array.from(map.values());
})();
console.log('Supervisors union in state:', supervisors.length, supervisors.slice(0, 10));

const managers = (() => {
	const areasForState = Object.values(data[state] || {});
	let filteredBySup = areasForState;
	if (supervisor) {
		const supNorm = (s) => typeof s === 'string' ? s.trim().toLowerCase() : '';
		filteredBySup = areasForState.filter(a => supNorm(a.supervisor) === supNorm(supervisor) || a.supervisorId === supervisor);
	}
	const map = new Map();
	filteredBySup.forEach(a => {
		const id = a.managerId || a.manager;
		const label = a.manager || a.managerId;
		if (id && label && !map.has(id)) map.set(id, { id, label });
	});
	return Array.from(map.values());
})();
console.log('Managers union in state (optionally filtered by supervisor):', managers.length, managers.slice(0, 10));

console.log('\nTesting each supervisor in state aggregated invoices:');
supervisors.forEach(sup => {
	const areas = getFilteredAreas(data, state, '', sup.id, '');
	const agg = aggregateAreas(areas, `${state} - ${sup.id}`);
	console.log(`Supervisor: ${sup.label} (${sup.id}) => invoices: ${agg?.kpis?.invoices || 'N/A'}, areas: ${areas.length}`);
});

console.log('\nTesting each manager in state aggregated invoices:');
const manList = [...new Set(Object.values(data[state] || {}).map(a => a.manager).filter(Boolean))];
manList.forEach(mgr => {
	const areas = getFilteredAreas(data, state, '', '', mgr.id || mgr);
	const agg = aggregateAreas(areas, `${state} - ${mgr.id || mgr}`);
	console.log(`Manager: ${mgr.label || mgr} (${mgr.id || mgr}) => invoices: ${agg?.kpis?.invoices || 'N/A'}, areas: ${areas.length}`);
});

// Simulate currentData behavior for area + supervisor/manager combos
console.log('\n--- Simulating currentData behavior for Area + Supervisor/Manager combos ---');
const combos = [
	{ area: 'AMALAPURAM', sup: '', mgr: '' },
	{ area: 'AMALAPURAM', sup: 'SUP_divya_202', mgr: '' },
	{ area: 'AMALAPURAM', sup: 'SUP_rina_201', mgr: '' },
	{ area: 'AMALAPURAM', sup: '', mgr: 'MGR_rohit_101' },
	{ area: 'AMALAPURAM', sup: 'SUP_rina_201', mgr: 'MGR_rohit_101' },
	{ area: '', sup: 'SUP_rina_201', mgr: '' },
	{ area: '', sup: '', mgr: 'MGR_rohit_101' },
];

combos.forEach(c => {
	const filtered = getFilteredAreas(data, state, c.area, c.sup, c.mgr);
	let result = null;
	if (c.area && !c.sup && !c.mgr && filtered.length === 1) {
		result = filtered[0];
	} else if (filtered.length > 0) {
		result = aggregateAreas(filtered, `${state} (combo)`);
	} else if ((c.sup || c.mgr) && c.area) {
		// fallback to sup/mgr level aggregation across state when the area filter doesn't match the selected sup/mgr
		const fallback = getFilteredAreas(data, state, '', c.sup, c.mgr);
		if (fallback.length > 0) {
			result = aggregateAreas(fallback, `${state} (combo - fallback)`);
		}
	}
	console.log(`combo area=${c.area || '-'} sup=${c.sup || '-'} mgr=${c.mgr || '-'} => filteredAreas=${filtered.length}, fallbackApplied=${!!result && filtered.length === 0 ? 'yes' : 'no'}, invoices=${result?.kpis?.invoices || 'N/A'}`);
});
