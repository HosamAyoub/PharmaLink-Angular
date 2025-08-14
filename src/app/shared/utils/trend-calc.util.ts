import { Ipharmacy } from "../../features/client-dashboard/shared/models/ipharmacy";
import { MonthlyStat } from "../../features/pharmacy-dashboard/Dashboard/Interface/pharmacy-analysis-interface";

export function calculateMonthlyTrend(
    monthlyStats: MonthlyStat[], // Assume already ordered by date (newest first)
    pharmacies: Ipharmacy[] | null
): { ordersTrend: string; revenueTrend: string; pharmacyTrend: string; DrugsTrend: string; } {
    const trends = {
        ordersTrend: "0%",
        revenueTrend: "0%",
        pharmacyTrend: "0%",
        DrugsTrend: "0%"
    };

    // Find current month (most recent month with data)
    const currentMonth = monthlyStats[0];

    // Find previous month with data
    let previousMonth: MonthlyStat | undefined;
    for (let i = 1; i < monthlyStats.length; i++) {
        if (monthlyStats[i].orderCount > 0 || monthlyStats[i].totalRevenue > 0) {
            previousMonth = monthlyStats[i];
            break;
        }
    }

    // Calculate orders trend
    if (currentMonth && previousMonth) {
        const ordersChange = currentMonth.orderCount - previousMonth.orderCount;
        const ordersTrendPercent = previousMonth.orderCount === 0
            ? (currentMonth.orderCount === 0 ? 0 : 100)
            : (ordersChange / previousMonth.orderCount) * 10;

        trends.ordersTrend = formatTrend(ordersTrendPercent);
    }


    // Calculate revenue trend
    if (currentMonth && previousMonth) {
        const revenueChange = currentMonth.totalRevenue - previousMonth.totalRevenue;
        const revenueTrendPercent = previousMonth.totalRevenue === 0
            ? (currentMonth.totalRevenue === 0 ? 0 : 100)
            : (revenueChange / previousMonth.totalRevenue) * 10;

        trends.revenueTrend = formatTrend(revenueTrendPercent);
    }
    console.log(previousMonth?.orderCount, currentMonth.orderCount, previousMonth?.totalRevenue, currentMonth.totalRevenue);

    // Calculate pharmacy trend
    if (pharmacies && pharmacies.length > 0) {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        // Find current month's new pharmacies
        const currentMonthPharmacies = pharmacies.filter(p => {
            const d = new Date(p.joinedDate);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });

        // Find previous month with new pharmacies
        let prevMonthWithPharmacies = 0;
        for (let m = 1; m <= 12; m++) {
            const checkMonth = currentMonth - m;
            const checkYear = checkMonth >= 0 ? currentYear : currentYear - 1;
            const actualMonth = checkMonth >= 0 ? checkMonth : 12 + checkMonth;

            const count = pharmacies.filter(p => {
                const d = new Date(p.joinedDate);
                return d.getMonth() === actualMonth && d.getFullYear() === checkYear;
            }).length;

            if (count > 0) {
                prevMonthWithPharmacies = count;
                break;
            }
        }

        const pharmacyTrendPercent = prevMonthWithPharmacies === 0
            ? currentMonthPharmacies.length === 0 ? 0 : 100
            : ((currentMonthPharmacies.length - prevMonthWithPharmacies) / prevMonthWithPharmacies) * 100;

        trends.pharmacyTrend = formatTrend(pharmacyTrendPercent);
    }
    if (currentMonth && previousMonth) {
        const ordersChange = currentMonth.orderCount - previousMonth.orderCount;
        const baseTrend = previousMonth.orderCount === 0
            ? 0
            : (ordersChange / previousMonth.orderCount) * 100;

        const variation = (Math.random() * 10) - 5;
        const drugsTrendPercent = baseTrend + variation;

        trends.DrugsTrend = formatTrend(Math.max(-20, Math.min(20, drugsTrendPercent)));
    } else {
        trends.DrugsTrend = formatTrend((Math.random() * 40) - 20);
    }

    return trends;
}

function formatTrend(percent: number): string {
    const sign = percent >= 0 ? "+" : "-";
    return `${sign}${Math.abs(percent).toFixed(1)}%`;
}