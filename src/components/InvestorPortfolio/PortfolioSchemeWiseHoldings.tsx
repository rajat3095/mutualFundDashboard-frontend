// frontend/src/components/PortfolioSchemeWiseHoldings.tsx
import { useState, useMemo, useContext, useEffect } from "react";
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
import { SchemeHolding } from "@/types/PortfolioSchemeWiseHoldingsType";
import { useParams } from "next/navigation";

type Order = "asc" | "desc";
type OrderBy = keyof SchemeHolding;

export default function SchemeHoldingsTable() {
  const { mode } = useContext(ColorModeContext); // Access the current theme mode
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<OrderBy>("currentValue");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [holdingsData, setHoldingsData] = useState<SchemeHolding[]>([]);
  const params = useParams();
  const investorId = params?.id as string;

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
        setHoldingsData(data);
      } catch (error) {
        console.error("Error fetching holdings data:", error);
      }
    };

    fetchHoldingsData();
  }, [investorId]);

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
