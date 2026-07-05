import { useEffect, useState, useMemo, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { fetchInvestors } from "../store/investorSlice";
import {
  selectInvestorDashboard,
  selectInvestorDashboardStatus,
  selectInvestorDashboardError,
} from "../store/feature/InvestorDashboard/InvestorDashboardSelector";
import { investorDashboardSliceActions } from "../store/feature/InvestorDashboard/InvestorDashboardReducer";
import { AppDispatch } from "../store";
import { useRouter } from "next/navigation";
import { Investor } from "@/types/InvestorType";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  TextField,
  TablePagination,
  TableSortLabel,
  Stack,
} from "@mui/material";
import { ColorModeContext } from "@/context/ThemeContext";

type Order = "asc" | "desc";
type OrderBy = "currentValue" | "xirr" | "";

export default function InvestorTable() {
  const { mode } = useContext(ColorModeContext);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const getInvestorList = useSelector(selectInvestorDashboard);
  const getStatus = useSelector(selectInvestorDashboardStatus);
  const error = useSelector(selectInvestorDashboardError);
  // --- Feature State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<OrderBy>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    if (getStatus === "idle") {
      dispatch(investorDashboardSliceActions.getInvestorListAction());
    }
  });

  // --- Sorting Handler ---
  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // --- Pagination Handlers ---
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing row count
  };

  // --- Click Handler for Row ---
  const handleRowClick = (investorId: string | number) => {
    // Adjust this path to match your actual Next.js route structure!
    router.push(`/portfolio/${investorId}`);
  };

  // --- Derived Data: Filter, Sort, and Paginate ---
  const processedData = useMemo(() => {
    // 1. Search Filter (searches both Name and PAN Number)
    let filteredList = getInvestorList.filter((investor: Investor) => {
      const query = searchQuery.toLowerCase();
      return (
        investor.name.toLowerCase().includes(query) ||
        investor.panNumber.toLowerCase().includes(query)
      );
    });

    // 2. Sorting
    if (orderBy) {
      filteredList = [...filteredList].sort((a, b) => {
        const valA = a[orderBy];
        const valB = b[orderBy];
        if (valA < valB) return order === "asc" ? -1 : 1;
        if (valA > valB) return order === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filteredList;
  }, [getInvestorList, searchQuery, order, orderBy]);

  // 3. Pagination Slice
  const paginatedData = processedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  if (getStatus === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography sx={{ color: "error", align: "center", p: 4 }}>
        Error: {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 3, width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2, p: 2, boxShadow: 3, borderRadius: 2 }}>
        {/* Search Bar (Responsive Stack) */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}
          spacing={2}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Investors
          </Typography>
          <TextField
            label="Search by Name or PAN"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0); // Reset page on search
            }}
            sx={{ minWidth: { xs: "100%", sm: 300 } }}
          />
        </Stack>

        {/* Table Container (Responsive Scroll) */}
        <TableContainer sx={{ maxHeight: 600, overflowX: "auto" }}>
          <Table
            stickyHeader
            sx={{ minWidth: 800 }}
            aria-label="investor table"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    bgcolor: mode === "dark" ? "grey.900" : "grey.100",
                    textTransform: "uppercase",
                  }}
                >
                  Investor Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    bgcolor: mode === "dark" ? "grey.900" : "grey.100",
                    textTransform: "uppercase",
                  }}
                >
                  PAN Number
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    bgcolor: mode === "dark" ? "grey.900" : "grey.100",
                    textTransform: "uppercase",
                  }}
                >
                  Folios
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    bgcolor: mode === "dark" ? "grey.900" : "grey.100",
                    textTransform: "uppercase",
                  }}
                >
                  Invested (₹)
                </TableCell>

                {/* Sortable Column: Current Value */}
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    bgcolor: mode === "dark" ? "grey.900" : "grey.100",
                    textTransform: "uppercase",
                  }}
                >
                  <TableSortLabel
                    active={orderBy === "currentValue"}
                    direction={orderBy === "currentValue" ? order : "asc"}
                    onClick={() => handleRequestSort("currentValue")}
                  >
                    Current Value (₹)
                  </TableSortLabel>
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: "bold",
                    bgcolor: mode === "dark" ? "grey.900" : "grey.100",
                    textTransform: "uppercase",
                  }}
                >
                  Absolute Gain/Loss (%)
                </TableCell>

                {/* Sortable Column: XIRR */}
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    bgcolor: mode === "dark" ? "grey.900" : "grey.100",
                    textTransform: "uppercase",
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
                paginatedData.map((investor: Investor) => (
                  <TableRow
                    key={investor.id}
                    hover
                    onClick={() => handleRowClick(investor.id)}
                    sx={{
                      cursor: "pointer",
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontWeight: "medium" }}
                    >
                      {investor.name}
                    </TableCell>
                    <TableCell>{investor.panNumber}</TableCell>
                    <TableCell>{investor.folioCount}</TableCell>
                    <TableCell>{investor.totalInvestment.toFixed(2)}</TableCell>
                    <TableCell>{investor.currentValue.toFixed(2)}</TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color:
                          investor.absoluteReturn > 0
                            ? "success.main"
                            : "error.main",
                      }}
                    >
                      {investor.absoluteReturn.toFixed(2)}%
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color:
                          investor.xirr > 0 ? "success.main" : "error.main",
                      }}
                    >
                      {investor.xirr.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No investors found matching &quot;{searchQuery}&quot;
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={processedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
