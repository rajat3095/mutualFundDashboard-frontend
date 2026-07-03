// frontend/src/components/PortfolioAnalytics.tsx
import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import { schemeData } from "@/types/PortfolioAnalyticsType";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { useParams } from "next/navigation";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

export default function PortfolioAnalytics() {
  const [schemeData, setSchemeData] = useState<schemeData[]>([]);
  const params = useParams();
  const investorId = params?.id as string;

  // --- 1. Aggregation Logic ---
  // const schemeData = useMemo(() => {
  //   const map = new Map<
  //     string,
  //     {
  //       schemeName: string;
  //       totalInvested: number;
  //       unitsHeld: number;
  //       latestNav: number;
  //     }
  //   >();

  //   transactions.forEach((tx) => {
  //     if (!map.has(tx.schemeName)) {
  //       map.set(tx.schemeName, {
  //         schemeName: tx.schemeName,
  //         totalInvested: 0,
  //         unitsHeld: 0,
  //         latestNav: tx.currentNav || tx.nav, // Initialize with currentNav
  //       });
  //     }
  //     const item = map.get(tx.schemeName);
  //     if (!item) return;

  //     // Explicitly set to currentNav so it doesn't rely on chronological sorting of historic navs
  //     item.latestNav = tx.currentNav || item.latestNav;

  //     if (tx.type === "PURCHASE") {
  //       item.totalInvested += tx.amount;
  //       item.unitsHeld += tx.units;
  //     } else if (tx.type === "REDEMPTION") {
  //       item.unitsHeld -= tx.units;
  //       // Depending on your accounting method (FIFO/Average), you may also want to reduce totalInvested here.
  //     }
  //   });

  //   return Array.from(map.values())
  //     .filter((item) => item.unitsHeld > 0.01) // Ignore empty holdings
  //     .map((item) => {
  //       const currentValue = item.unitsHeld * item.latestNav;
  //       const returnPercent =
  //         item.totalInvested > 0
  //           ? ((currentValue - item.totalInvested) / item.totalInvested) * 100
  //           : 0;

  //       return {
  //         ...item,
  //         currentValue,
  //         returnPercent,
  //       };
  //     })
  //     .sort((a, b) => b.currentValue - a.currentValue); // Sort by highest value
  // }, [transactions]);

  useEffect(() => {
    // Fetch holdings data from the API and set it to state
    const fetchHoldingsData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/investors/${investorId}/schemeSummary`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        const data = await response.json();
        setSchemeData(data);
      } catch (error) {
        console.error("Error fetching holdings data:", error);
      }
    };

    fetchHoldingsData();
  }, [investorId]);

  // --- 2. Chart Configurations ---

  // Common colors
  const colors = [
    "rgba(59, 130, 246, 0.8)", // Blue
    "rgba(16, 185, 129, 0.8)", // Emerald
    "rgba(245, 158, 11, 0.8)", // Amber
    "rgba(139, 92, 246, 0.8)", // Violet
    "rgba(239, 68, 68, 0.8)", // Red
    "rgba(236, 72, 153, 0.8)", // Pink
  ];

  // A. Investment vs Current Value (Grouped Bar Chart)
  const investVsCurrentData = {
    labels: schemeData.map((d) => d.schemeName),
    datasets: [
      {
        label: "Invested Amount",
        data: schemeData.map((d) => d.investedAmount),
        backgroundColor: "rgba(156, 163, 175, 0.6)", // Gray
      },
      {
        label: "Current Value",
        data: schemeData.map((d) => d.currentValue),
        backgroundColor: "rgba(59, 130, 246, 0.8)", // Blue
      },
    ],
  };

  // B. Scheme-wise Return Distribution (Bar Chart)
  const returnDistributionData = {
    labels: schemeData.map((d) => d.schemeName),
    datasets: [
      {
        label: "Absolute Return (%)",
        data: schemeData.map((d) => d.returnPercent),
        backgroundColor: schemeData.map((d) =>
          d.returnPercent >= 0
            ? "rgba(114, 185, 16, 0.8)"
            : "rgba(239, 68, 68, 0.8)",
        ),
      },
      {
        label: "XIRR Return (%)",
        data: schemeData.map((d) => d.xirr),
        backgroundColor: schemeData.map((d) =>
          d.xirr >= 0 ? "rgba(16, 185, 129, 0.8)" : "rgba(239, 68, 68, 0.8)",
        ),
      },
    ],
  };

  // C. Top Holdings by Current Value (Doughnut Chart)
  const topHoldings = schemeData.slice(0, 5); // Take top 5
  const topHoldingsData = {
    labels: topHoldings.map((d) => d.schemeName),
    datasets: [
      {
        data: topHoldings.map((d) => d.currentValue),
        backgroundColor: colors.slice(0, 5),
        borderWidth: 1,
      },
    ],
  };

  // D. Asset Allocation (Mock logic based on scheme names for demonstration)
  // In a real scenario, your API should return 'category' (Equity, Debt, Gold).
  const calculateAllocation = () => {
    let equity = 0;
    let debt = 0;
    let others = 0;
    schemeData.forEach((d) => {
      const name = d.schemeName.toLowerCase();
      if (
        name.includes("equity") ||
        name.includes("bluechip") ||
        name.includes("flexi")
      )
        equity += d.currentValue;
      else if (
        name.includes("debt") ||
        name.includes("liquid") ||
        name.includes("bond")
      )
        debt += d.currentValue;
      else others += d.currentValue;
    });
    return [equity, debt, others];
  };

  const assetAllocationData = {
    labels: ["Equity", "Debt", "Others"],
    datasets: [
      {
        data: calculateAllocation(),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" as const },
    },
  };

  if (!schemeData.length) return null;

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>
        Portfolio Analytics
      </Typography>
      <Grid container spacing={3}>
        {/* Chart 1: Investment vs Current Value */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold" }}
                gutterBottom
              >
                Investment vs Current Value
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar data={investVsCurrentData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Chart 2: Scheme-wise Return Distribution */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold" }}
                gutterBottom
              >
                Scheme-wise Return (%)
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar data={returnDistributionData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Chart 3: Top Holdings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold" }}
                gutterBottom
              >
                Top Holdings (Current Value)
              </Typography>
              <Box sx={{ height: 300 }}>
                <Doughnut data={topHoldingsData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Chart 4: Asset Allocation */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold" }}
                gutterBottom
              >
                Asset Allocation (Estimated)
              </Typography>
              <Box sx={{ height: 300 }}>
                <Doughnut data={assetAllocationData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
