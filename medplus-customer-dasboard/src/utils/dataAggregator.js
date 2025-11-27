
export const aggregateStateData = (stateName, fullData) => {
    const stateData = fullData[stateName];
    if (!stateData) return null;
    const areas = Object.values(stateData);
    if (areas.length === 0) return null;
    const title = `MedPlus - ${stateName} (State View)`;
    return aggregateAreas(areas, title);
};

// Aggregate a list of area objects (areas can be a subset filtered by area, manager or supervisor)
export const aggregateAreas = (areas = [], title = 'Aggregated View') => {
    if (!areas || areas.length === 0) return null;
    const aggregated = JSON.parse(JSON.stringify(areas[0]));

    // KPIs
    let totalInvoices = 0;
    let totalRevenue = 0;
    let totalActiveUsers = 0;
    let totalPlans = 0;

    areas.forEach(area => {
        totalInvoices += area?.kpis?.invoices || 0;
        totalRevenue += area?.kpis?.revenue || 0;
        totalActiveUsers += area?.kpis?.todaysActiveUsers || 0;
        totalPlans += area?.kpis?.mtdMaPharmaPlansSold || 0;
    });

    aggregated.kpis.invoices = totalInvoices;
    aggregated.kpis.revenue = totalRevenue;
    aggregated.kpis.todaysActiveUsers = totalActiveUsers;
    aggregated.kpis.mtdMaPharmaPlansSold = totalPlans;
    aggregated.kpis.aov = totalInvoices > 0 ? Math.round(totalRevenue / totalInvoices) : 0;

    // Update metadata title
    aggregated.metadata.title = title;

    // Trend panel aggregations - reuse same approach as earlier
    if (aggregated.trendPanel?.monthlyRevenue) {
        aggregated.trendPanel.monthlyRevenue = aggregated.trendPanel.monthlyRevenue.map((item, index) => {
            let sum = 0;
            areas.forEach(area => {
                sum += area.trendPanel?.monthlyRevenue?.[index]?.revenue || 0;
            });
            return { ...item, revenue: sum };
        });
    }

    if (aggregated.trendPanel?.mauDauTrend) {
        aggregated.trendPanel.mauDauTrend = aggregated.trendPanel.mauDauTrend.map((item, index) => {
            let sumMau = 0;
            let sumDau = 0;
            areas.forEach(area => {
                sumMau += area.trendPanel?.mauDauTrend?.[index]?.mau || 0;
                sumDau += area.trendPanel?.mauDauTrend?.[index]?.dau || 0;
            });
            return { ...item, mau: sumMau, dau: sumDau };
        });
    }

    if (aggregated.trendPanel?.newCustomerAcquisition) {
        aggregated.trendPanel.newCustomerAcquisition = aggregated.trendPanel.newCustomerAcquisition.map((item, index) => {
            let sum = 0;
            areas.forEach(area => {
                sum += area.trendPanel?.newCustomerAcquisition?.[index]?.count || 0;
            });
            return { ...item, count: sum };
        });
    }

    // Customer segmentation
    if (aggregated.customerSegmentation?.byPurchaseValue) {
        aggregated.customerSegmentation.byPurchaseValue = aggregated.customerSegmentation.byPurchaseValue.map((item, index) => {
            let sum = 0;
            areas.forEach(area => {
                sum += area.customerSegmentation?.byPurchaseValue?.[index]?.customerCount || 0;
            });
            return { ...item, customerCount: sum };
        });
    }

    if (aggregated.customerSegmentation?.revenueByType) {
        aggregated.customerSegmentation.revenueByType = aggregated.customerSegmentation.revenueByType.map((item, index) => {
            let sum = 0;
            areas.forEach(area => {
                sum += area.customerSegmentation?.revenueByType?.[index]?.revenue || 0;
            });
            return { ...item, revenue: sum };
        });
    }

    // Sales Invoice Analytics
    if (aggregated.salesInvoiceAnalytics?.invoiceCountByPurchaseSlab) {
        aggregated.salesInvoiceAnalytics.invoiceCountByPurchaseSlab = aggregated.salesInvoiceAnalytics.invoiceCountByPurchaseSlab.map((item, index) => {
            let sum = 0;
            areas.forEach(area => {
                sum += area.salesInvoiceAnalytics?.invoiceCountByPurchaseSlab?.[index]?.invoiceCount || 0;
            });
            return { ...item, invoiceCount: sum };
        });
    }

    if (aggregated.salesInvoiceAnalytics?.averageInvoiceCount) {
        aggregated.salesInvoiceAnalytics.averageInvoiceCount = aggregated.salesInvoiceAnalytics.averageInvoiceCount.map((item, index) => {
            let sum = 0;
            areas.forEach(area => {
                sum += area.salesInvoiceAnalytics?.averageInvoiceCount?.[index]?.count || 0;
            });
            return { ...item, count: sum };
        });
    }

    // Customer Retention
    try {
        const months = ['M0','M1','M2','M3','M4','M5','M6','M7','M8','M9','M10','M11','M12'];
        const retentionMap = new Map();
        months.forEach(m => {
            retentionMap.set(m, {
                retentionMonth: m,
                customers: 0,
                invoices: 0,
                total: 0,
                pBrC: 0,
                pPlC: 0,
                pBrA: 0,
                pPlA: 0,
                nBr: 0,
                nPl: 0,
                sip: 0,
            });
        });

        areas.forEach(area => {
            const areaRetention = area.customerRetention || {};
            const cohorts = areaRetention.cohorts || [];
            const areaM0 = (areaRetention.volumeMetricsByRetentionMonth || []).find(r => (r.retentionMonth || r.retention_month || r.month || '').toUpperCase() === 'M0') || {};
            const areaM0Customers = Number((areaM0.customers || areaM0.customers || 0) || 0);
            const areaM0Invoices = Number(areaM0.invoices || areaM0.invoice || 0);
            const areaM0Total = Number(areaM0.total || areaM0.totalRevenue || 0);
            const cat = areaM0.categoryRevenueSplit || areaM0.categoryRevenueSplit || {};
            const areaCat = {
                pBrC: Number(cat.P_BR_C || cat.pBrC || 0),
                pPlC: Number(cat.P_PL_C || cat.pPlC || 0),
                pBrA: Number(cat.P_BR_A || cat.pBrA || 0),
                pPlA: Number(cat.P_PL_A || cat.pPlA || 0),
                nBr: Number(cat.N_BR || cat.nBr || 0),
                nPl: Number(cat.N_PL || cat.nPl || 0),
                sip: Number(cat.SIP || cat.sip || 0),
            };

            const m0Row = retentionMap.get('M0');
            m0Row.customers += areaM0Customers;
            m0Row.invoices += areaM0Invoices;
            m0Row.total += areaM0Total;
            m0Row.pBrC += areaCat.pBrC;
            m0Row.pPlC += areaCat.pPlC;
            m0Row.pBrA += areaCat.pBrA;
            m0Row.pPlA += areaCat.pPlA;
            m0Row.nBr += areaCat.nBr;
            m0Row.nPl += areaCat.nPl;
            m0Row.sip += areaCat.sip;

            cohorts.forEach(cohort => {
                const m0C = Number(cohort.m0_customers || 0);
                const retentionPct = cohort.retentionPct || {};
                Object.keys(retentionPct).forEach(k => {
                    // keys can be 'm1', 'm2' etc
                    const monthKey = k.toUpperCase();
                    const pct = Number(retentionPct[k] || 0);
                    const retainedCustomers = Math.round(m0C * pct / 100);
                    const row = retentionMap.get(monthKey);
                    if (row) {
                        row.customers += retainedCustomers;
                    }
                });
            });
        });

        // Compose final retention array with percentage strings for M1..M12
        const m0Customers = retentionMap.get('M0').customers || 0;
        const m0Invoices = retentionMap.get('M0').invoices || 0;
        const m0Total = retentionMap.get('M0').total || 0;
        const finalRetention = [];
        months.forEach(m => {
            const r = retentionMap.get(m);
            if (!r) return;
            if (m === 'M0') {
                finalRetention.push({
                    retentionMonth: r.retentionMonth,
                    customers: r.customers,
                    invoices: r.invoices,
                    total: r.total,
                    pBrC: r.pBrC,
                    pPlC: r.pPlC,
                    pBrA: r.pBrA,
                    pPlA: r.pPlA,
                    nBr: r.nBr,
                    nPl: r.nPl,
                    sip: r.sip,
                });
            } else {
                const pct = m0Customers > 0 ? `${Math.round((r.customers / m0Customers) * 100)}%` : '0%';
                finalRetention.push({
                    retentionMonth: r.retentionMonth,
                    customers: r.customers,
                    invoices: m0Invoices > 0 ? `${Math.round((r.customers / m0Customers) * 100)}%` : '0%'
                    ,
                    total: m0Total > 0 ? `${Math.round((r.customers / m0Customers) * 100)}%` : '0%'
                    ,
                    pBrC: pct,
                    pPlC: pct,
                    pBrA: pct,
                    pPlA: pct,
                    nBr: pct,
                    nPl: pct,
                    sip: pct,
                });
            }
        });

        aggregated.customerRetention = aggregated.customerRetention || {};
        aggregated.customerRetention.volumeMetricsByRetentionMonth = finalRetention;
    } catch (err) {
        // keep whatever is present in the first area
        console.warn('customerRetention aggregation error', err);
    }

    return aggregated;
};

// Helper to get areas filtered by criteria
export const getFilteredAreas = (fullData, stateName, areaName = '', supervisor = '', manager = '') => {
    if (!stateName || !fullData[stateName]) return [];
    const areasObj = fullData[stateName];
    let areaNames = Object.keys(areasObj || {});

    if (areaName) {
        areaNames = areaNames.filter(a => a === areaName);
    }

    const areasList = areaNames.map(name => ({ ...areasObj[name], __areaName: name }));

    const normalize = (v) => typeof v === 'string' ? v.trim().toLowerCase() : '';
    const isId = (v) => typeof v === 'string' && (v.startsWith('SUP_') || v.startsWith('MGR_'));
    const supNorm = normalize(supervisor);
    const mgrNorm = normalize(manager);
    const filtered = areasList.filter(a => {
        if (supNorm) {
            if (isId(supervisor)) {
                if ((a.supervisorId || '').trim() !== supervisor.trim()) return false;
            } else {
                if (normalize(a.supervisor) !== supNorm) return false;
            }
        }
        if (mgrNorm) {
            if (isId(manager)) {
                if ((a.managerId || '').trim() !== manager.trim()) return false;
            } else {
                if (normalize(a.manager) !== mgrNorm) return false;
            }
        }
        return true;
    });

    return filtered;
};
