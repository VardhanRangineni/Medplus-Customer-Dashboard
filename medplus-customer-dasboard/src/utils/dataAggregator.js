
export const aggregateStateData = (stateName, fullData) => {
    const stateData = fullData[stateName];
    if (!stateData) return null;

    const areas = Object.values(stateData);
    if (areas.length === 0) return null;

    // Use the first area as a template for structure
    const aggregated = JSON.parse(JSON.stringify(areas[0]));

    // --- 1. Aggregate KPIs ---
    let totalInvoices = 0;
    let totalRevenue = 0;
    let totalActiveUsers = 0;
    let totalPlans = 0;

    areas.forEach(area => {
        totalInvoices += area.kpis.invoices || 0;
        totalRevenue += area.kpis.revenue || 0;
        totalActiveUsers += area.kpis.todaysActiveUsers || 0;
        totalPlans += area.kpis.mtdMaPharmaPlansSold || 0;
    });

    aggregated.kpis.invoices = totalInvoices;
    aggregated.kpis.revenue = totalRevenue;
    aggregated.kpis.todaysActiveUsers = totalActiveUsers;
    aggregated.kpis.mtdMaPharmaPlansSold = totalPlans;
    aggregated.kpis.aov = totalInvoices > 0 ? Math.round(totalRevenue / totalInvoices) : 0;

    // Update metadata title
    aggregated.metadata.title = `MedPlus - ${stateName} (State View)`;

    // --- 2. Aggregate Trend Panel ---

    // Monthly Revenue
    if (aggregated.trendPanel?.monthlyRevenue) {
        aggregated.trendPanel.monthlyRevenue = aggregated.trendPanel.monthlyRevenue.map((item, index) => {
            let sum = 0;
            areas.forEach(area => {
                sum += area.trendPanel?.monthlyRevenue?.[index]?.revenue || 0;
            });
            return { ...item, revenue: sum };
        });
    }

    // MAU/DAU
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

    // New Customer Acquisition
    if (aggregated.trendPanel?.newCustomerAcquisition) {
        aggregated.trendPanel.newCustomerAcquisition = aggregated.trendPanel.newCustomerAcquisition.map((item, index) => {
            let sum = 0;
            areas.forEach(area => {
                sum += area.trendPanel?.newCustomerAcquisition?.[index]?.count || 0;
            });
            return { ...item, count: sum };
        });
    }

    // --- 3. Aggregate Segmentation ---

    // By Purchase Value (Sum customer counts)
    if (aggregated.customerSegmentation?.byPurchaseValue) {
        aggregated.customerSegmentation.byPurchaseValue = aggregated.customerSegmentation.byPurchaseValue.map((item, index) => {
            let sum = 0;
            areas.forEach(area => {
                sum += area.customerSegmentation?.byPurchaseValue?.[index]?.customerCount || 0;
            });
            return { ...item, customerCount: sum };
        });
    }

    // Revenue By Type (Sum revenue)
    if (aggregated.customerSegmentation?.revenueByType) {
        aggregated.customerSegmentation.revenueByType = aggregated.customerSegmentation.revenueByType.map((item, index) => {
            let sum = 0;
            areas.forEach(area => {
                sum += area.customerSegmentation?.revenueByType?.[index]?.revenue || 0;
            });
            return { ...item, revenue: sum };
        });
    }

    // --- 4. Sales Invoice Analytics ---

    // Invoice Count By Purchase Slab
    if (aggregated.salesInvoiceAnalytics?.invoiceCountByPurchaseSlab) {
        aggregated.salesInvoiceAnalytics.invoiceCountByPurchaseSlab = aggregated.salesInvoiceAnalytics.invoiceCountByPurchaseSlab.map((item, index) => {
            let sum = 0;
            areas.forEach(area => {
                sum += area.salesInvoiceAnalytics?.invoiceCountByPurchaseSlab?.[index]?.invoiceCount || 0;
            });
            return { ...item, invoiceCount: sum };
        });
    }

    // Average Invoice Count
    if (aggregated.salesInvoiceAnalytics?.averageInvoiceCount) {
        aggregated.salesInvoiceAnalytics.averageInvoiceCount = aggregated.salesInvoiceAnalytics.averageInvoiceCount.map((item, index) => {
            let sum = 0;
            areas.forEach(area => {
                sum += area.salesInvoiceAnalytics?.averageInvoiceCount?.[index]?.count || 0;
            });
            return { ...item, count: sum };
        });
    }

    return aggregated;
};
