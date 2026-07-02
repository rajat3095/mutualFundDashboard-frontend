"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  Alert,
  AlertTitle,
  Collapse,
  IconButton,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";

import PortfolioSummary, {
  InvestorSummaryData,
} from "@/components/PortfolioSummary";
import SchemeHoldingsTable from "@/components/SchemeHoldingsTable";
import PortfolioAnalytics from "@/components/charts/PortfolioAnalytics";

interface Transaction {
  _id: string;
  folioNumber: string;
  schemeName: string;
  date: string;
  type: "PURCHASE" | "REDEMPTION";
  amount: number;
  units: number;
  nav: number;
  currentNav: number;
}

interface ApiInvestorData {
  _id: string;
  name: string;
  panNumber: string;
  transactions: Transaction[];
}

export default function PortfolioPage() {
  const params = useParams();
  const router = useRouter();
  const investorId = params?.id as string;

  const [apiData, setApiData] = useState<ApiInvestorData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [showWarnings, setShowWarnings] = useState<boolean>(true);

  // --- 1. Data Sanitization Engine ---
  const sanitizeTransactions = (transactions: Transaction[]) => {
    const dataWarnings: string[] = [];
    const uniqueIds = new Set<string>();
    const validTransactions: Transaction[] = [];

    transactions.forEach((tx, index) => {
      // Rule A: Missing critical values
      if (
        !tx._id ||
        !tx.schemeName ||
        !tx.type ||
        tx.amount == null ||
        tx.units == null ||
        tx.nav == null ||
        tx.currentNav == null
      ) {
        dataWarnings.push(
          `Skipped record at index ${index}: Missing required fields.`,
        );
        return;
      }

      // Rule B: Duplicate records
      if (uniqueIds.has(tx._id)) {
        dataWarnings.push(
          `Skipped duplicate transaction ID: ${tx._id} (${tx.schemeName}).`,
        );
        return;
      }

      // Rule C: Incorrect transaction data (Negative or zero amounts/units/navs)
      if (tx.amount <= 0 || tx.units <= 0 || tx.nav <= 0) {
        dataWarnings.push(
          `Skipped invalid data for ${tx.schemeName}: Amount, Units, and NAV must be greater than zero.`,
        );
        return;
      }

      // Rule D: Invalid Transaction Type
      if (tx.type !== "PURCHASE" && tx.type !== "REDEMPTION") {
        dataWarnings.push(
          `Skipped unknown transaction type "${tx.type}" for ${tx.schemeName}.`,
        );
        return;
      }

      uniqueIds.add(tx._id);
      validTransactions.push(tx);
    });

    return { validTransactions, dataWarnings };
  };

  // --- 2. API Fetch with Error Handling ---
  useEffect(() => {
    if (!investorId) return;

    const fetchInvestorSummary = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:5000/api/investors/${investorId}/summary`,
        );

        // Handle standard HTTP errors
        if (response.status === 404) throw new Error("Investor not found.");
        if (!response.ok)
          throw new Error(`Server Error: ${response.statusText}`);

        const data: ApiInvestorData = await response.json();

        // Handle malformed JSON structures
        if (!data || !Array.isArray(data.transactions)) {
          throw new Error("Received malformed data from the server.");
        }

        // Sanitize the data before setting it into state
        const { validTransactions, dataWarnings } = sanitizeTransactions(
          data.transactions,
        );

        setWarnings(dataWarnings);
        setApiData({ ...data, transactions: validTransactions });
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "An unknown error occurred while fetching data.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInvestorSummary();
  }, [investorId]);

  // --- 3. Summary Aggregation ---
  const summaryData: InvestorSummaryData | null = useMemo(() => {
    if (!apiData || !apiData.transactions.length) return null;

    let totalInvestment = 0;
    let currentUnits = 0;
    let latestNav = 0;
    const uniqueFolios = new Set<string>();
    const uniqueSchemes = new Set<string>();

    apiData.transactions.forEach((tx) => {
      uniqueFolios.add(tx.folioNumber);
      uniqueSchemes.add(tx.schemeName);
      latestNav = tx.currentNav;

      if (tx.type === "PURCHASE") {
        totalInvestment += tx.amount;
        currentUnits += tx.units;
      } else if (tx.type === "REDEMPTION") {
        currentUnits -= tx.units;
      }
    });

    // Prevent negative overall portfolio units due to bad redemption data
    if (currentUnits < 0) currentUnits = 0;

    const currentMarketValue = currentUnits * latestNav;
    const totalGainLoss = currentMarketValue - totalInvestment;
    const absoluteReturn =
      totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;
    const estimatedXirr = absoluteReturn / 1.5;

    return {
      name: apiData.name,
      totalInvestment,
      currentMarketValue,
      totalGainLoss,
      absoluteReturn,
      xirr: estimatedXirr,
      schemeCount: uniqueSchemes.size,
      folioCount: uniqueFolios.size,
    };
  }, [apiData]);

  // --- Render States ---
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Fatal Error State
  if (error || !apiData) {
    return (
      <Container maxWidth="md" sx={{ mt: 6, textAlign: "center" }}>
        <Alert severity="error" variant="filled" sx={{ mb: 3 }}>
          <AlertTitle>Data Loading Failed</AlertTitle>
          {error || "Unable to retrieve investor data."}
        </Alert>
        <Button variant="contained" onClick={() => router.push("/")}>
          Return to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Stack sx={{ m: 4 }}>
      <Stack
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "left",
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => router.push("/")}
          sx={{ mb: 3, color: "text.secondary" }}
        >
          Back to Investors
        </Button>
      </Stack>

      {/* Non-Fatal Data Warnings */}
      <Collapse in={showWarnings && warnings.length > 0}>
        <Alert
          severity="warning"
          sx={{ mb: 4 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setShowWarnings(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <AlertTitle>Data Discrepancies Found</AlertTitle>
          Some records were skipped to ensure accurate calculations:
          <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px" }}>
            {warnings.map((warn, i) => (
              <li key={i}>
                <Typography variant="body2">{warn}</Typography>
              </li>
            ))}
          </ul>
        </Alert>
      </Collapse>

      {/* Main Content (Only renders valid data) */}
      {summaryData ? (
        <>
          <Box sx={{ mb: 4 }}>
            <PortfolioSummary data={summaryData} />
          </Box>
          <PortfolioAnalytics transactions={apiData.transactions} />
          <SchemeHoldingsTable transactions={apiData.transactions} />
        </>
      ) : (
        <Alert severity="info">
          No valid transaction data available for this investor.
        </Alert>
      )}
    </Stack>
  );
}
