// frontend/src/components/SchemeHoldingsTable.tsx
import { useState, useMemo, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TextField,
  TablePagination,
  TableSortLabel,
  Stack,
} from "@mui/material";
import { ColorModeContext } from "@/context/ThemeContext";

// Ensure this matches your API transaction structure
export interface Transaction {
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

interface SchemeHolding {
  id: string; // Unique key (schemeName + folioNumber)
  schemeName: string;
  folioNumber: string;
  unitsHeld: number;
  avgPurchaseNav: number;
  currentNav: number;
  investedAmount: number;
  currentValue: number;
  gainLoss: number;
  returnPercent: number;
  xirr: number;
}

interface SchemeHoldingsTableProps {
  transactions: Transaction[];
}

type Order = "asc" | "desc";
type OrderBy = keyof SchemeHolding;

export default function SchemeHoldingsTable({
  transactions,
}: SchemeHoldingsTableProps) {
  const { mode } = useContext(ColorModeContext); // Access the current theme mode
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<OrderBy>("currentValue");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // --- 1. Aggregation Logic ---
  // Groups transactions by Scheme + Folio to calculate current holdings
  const holdingsData: SchemeHolding[] = useMemo(() => {
    const holdingsMap = new Map<
      string,
      {
        id: string;
        schemeName: string;
        folioNumber: string;
        totalUnitsPurchased: number;
        totalPurchaseCost: number;
        unitsHeld: number;
        latestNav: number;
      }
    >();

    transactions.forEach((tx) => {
      const key = `${tx.folioNumber}-${tx.schemeName}`;

      if (!holdingsMap.has(key)) {
        holdingsMap.set(key, {
          id: key,
          schemeName: tx.schemeName,
          folioNumber: tx.folioNumber,
          totalUnitsPurchased: 0,
          totalPurchaseCost: 0,
          unitsHeld: 0,
          latestNav: 0,
        });
      }

      const holding = holdingsMap.get(key);
      if (!holding) return;

      holding.latestNav = tx.currentNav; // Assuming chronologically ordered, last NAV is current

      if (tx.type === "PURCHASE") {
        holding.totalUnitsPurchased += tx.units;
        holding.totalPurchaseCost += tx.amount;
        holding.unitsHeld += tx.units;
      } else if (tx.type === "REDEMPTION") {
        holding.unitsHeld -= tx.units;
      }
    });

    const calculatedHoldings: SchemeHolding[] = [];

    holdingsMap.forEach((holding) => {
      // Ignore schemes that have been fully redeemed
      if (holding.unitsHeld <= 0.01) return;

      const avgPurchaseNav =
        holding.totalPurchaseCost / holding.totalUnitsPurchased || 0;
      const investedAmount = holding.unitsHeld * avgPurchaseNav;
      const currentValue = holding.unitsHeld * holding.latestNav;
      const gainLoss = currentValue - investedAmount;
      const returnPercent =
        investedAmount > 0 ? (gainLoss / investedAmount) * 100 : 0;

      // Mock XIRR calculation (Requires a library like 'xirr' for true calculation)
      const xirr = returnPercent / 1.5;

      calculatedHoldings.push({
        id: holding.id,
        schemeName: holding.schemeName,
        folioNumber: holding.folioNumber,
        unitsHeld: holding.unitsHeld,
        avgPurchaseNav,
        currentNav: holding.latestNav,
        investedAmount,
        currentValue,
        gainLoss,
        returnPercent,
        xirr,
      });
    });

    return calculatedHoldings;
  }, [transactions]);

  // --- 2. Sorting & Filtering ---
  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const processedData = useMemo(() => {
    let filteredList = holdingsData.filter((holding) =>
      holding.schemeName.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (orderBy) {
      filteredList = filteredList.sort((a, b) => {
        const valA = a[orderBy];
        const valB = b[orderBy];
        if (valA < valB) return order === "asc" ? -1 : 1;
        if (valA > valB) return order === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filteredList;
  }, [holdingsData, searchQuery, order, orderBy]);

  // --- 3. Pagination ---
  const paginatedData = processedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(val);

  return (
    <Box sx={{ mt: 4, width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2, p: 2, boxShadow: 3, borderRadius: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            spacing: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Scheme-wise Holdings
          </Typography>
          <TextField
            label="Search Scheme"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: { xs: "100%", sm: 300 } }}
          />
        </Stack>

        <TableContainer sx={{ maxHeight: 600, overflowX: "auto" }}>
          <Table
            stickyHeader
            sx={{ minWidth: 1000 }}
            aria-label="scheme holdings table"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    bgcolor: mode === "dark" ? "grey.900" : "grey.100",
                  }}
                >
                  Scheme Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    bgcolor: mode === "dark" ? "grey.900" : "grey.100",
                  }}
                >
                  Folio
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    bgcolor: mode === "dark" ? "grey.900" : "grey.100",
                  }}
                >
                  Units
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    bgcolor: mode === "dark" ? "grey.900" : "grey.100",
                  }}
                >
                  Avg NAV (₹)
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    bgcolor: mode === "dark" ? "grey.900" : "grey.100",
                  }}
                >
                  Cur NAV (₹)
                </TableCell>

                {/* Sortable: Invested */}
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    bgcolor: mode === "dark" ? "grey.900" : "grey.100",
                  }}
                >
                  <TableSortLabel
                    active={orderBy === "investedAmount"}
                    direction={orderBy === "investedAmount" ? order : "asc"}
                    onClick={() => handleRequestSort("investedAmount")}
                  >
                    Invested
                  </TableSortLabel>
                </TableCell>

                {/* Sortable: Current Value */}
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    bgcolor: mode === "dark" ? "grey.900" : "grey.100",
                  }}
                >
                  <TableSortLabel
                    active={orderBy === "currentValue"}
                    direction={orderBy === "currentValue" ? order : "asc"}
                    onClick={() => handleRequestSort("currentValue")}
                  >
                    Cur. Value
                  </TableSortLabel>
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: "bold",
                    bgcolor: mode === "dark" ? "grey.900" : "grey.100",
                  }}
                >
                  Gain/Loss
                </TableCell>

                {/* Sortable: Return */}
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    bgcolor: mode === "dark" ? "grey.900" : "grey.100",
                  }}
                >
                  <TableSortLabel
                    active={orderBy === "returnPercent"}
                    direction={orderBy === "returnPercent" ? order : "asc"}
                    onClick={() => handleRequestSort("returnPercent")}
                  >
                    Return (%)
                  </TableSortLabel>
                </TableCell>

                {/* Sortable: XIRR */}
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    bgcolor: mode === "dark" ? "grey.900" : "grey.100",
                  }}
                >
                  <TableSortLabel
                    active={orderBy === "xirr"}
                    direction={orderBy === "xirr" ? order : "asc"}
                    onClick={() => handleRequestSort("xirr")}
                  >
                    XIRR (%)
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontWeight: "medium" }}>
                      {row.schemeName}
                    </TableCell>
                    <TableCell>{row.folioNumber}</TableCell>
                    <TableCell>{row.unitsHeld.toFixed(3)}</TableCell>
                    <TableCell>{row.avgPurchaseNav.toFixed(2)}</TableCell>
                    <TableCell>{row.currentNav.toFixed(2)}</TableCell>
                    <TableCell>{formatCurrency(row.investedAmount)}</TableCell>
                    <TableCell>{formatCurrency(row.currentValue)}</TableCell>
                    <TableCell
                      sx={{
                        color:
                          row.gainLoss >= 0 ? "success.main" : "error.main",
                        fontWeight: "bold",
                      }}
                    >
                      {row.gainLoss > 0 ? "+" : ""}
                      {formatCurrency(row.gainLoss)}
                    </TableCell>
                    <TableCell
                      sx={{
                        color:
                          row.returnPercent >= 0
                            ? "success.main"
                            : "error.main",
                        fontWeight: "bold",
                      }}
                    >
                      {row.returnPercent.toFixed(2)}%
                    </TableCell>
                    <TableCell
                      sx={{
                        color: row.xirr >= 0 ? "success.main" : "error.main",
                        fontWeight: "bold",
                      }}
                    >
                      {row.xirr.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No holdings found matching &quot;{searchQuery}&quot;
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={processedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>
    </Box>
  );
}
