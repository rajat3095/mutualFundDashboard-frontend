import { useContext } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Divider,
} from "@mui/material";
import { ColorModeContext } from "@/context/ThemeContext";
import { PortfolioSummaryProps } from "@/types/PortfolioSummaryType";

export default function PortfolioSummary({ data }: PortfolioSummaryProps) {
  const { mode } = useContext(ColorModeContext);
  if (!data) return null;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  return (
    <Card sx={{ mb: 3, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
            {data.name}&apos;s Portfolio
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Overview & Key Metrics
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          {/* Total Investment */}
          <Grid size={{ xs: 12, sm: 4, md: 3, lg: 3, xl: 2 }}>
            <Box
              sx={{
                p: 2,
                border: 1,
                borderColor: "grey.300",
                borderRadius: 2,
                bgcolor: mode === "dark" ? "grey.800" : "grey.50",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: "medium" }}
              >
                Total Investment
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {formatCurrency(data.totalInvestment)}
              </Typography>
            </Box>
          </Grid>

          {/* Current Value */}
          <Grid size={{ xs: 12, sm: 4, md: 3, lg: 3, xl: 2 }}>
            <Box
              sx={{
                p: 2,
                border: 1,
                borderColor: "grey.300",
                borderRadius: 2,
                bgcolor: mode === "dark" ? "grey.800" : "grey.50",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: "medium" }}
              >
                Current Value
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {formatCurrency(data.currentMarketValue)}
              </Typography>
            </Box>
          </Grid>

          {/* Total Gain/Loss */}
          <Grid size={{ xs: 12, sm: 4, md: 3, lg: 3, xl: 2 }}>
            <Box
              sx={{
                p: 2,
                border: 1,
                borderColor: "grey.300",
                borderRadius: 2,
                bgcolor: mode === "dark" ? "grey.800" : "grey.50",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: "medium" }}
              >
                Total Gain/Loss
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold" }}
                color={data.totalGainLoss >= 0 ? "success.main" : "error.main"}
              >
                {data.totalGainLoss > 0 ? "+" : ""}
                {formatCurrency(data.totalGainLoss)}
              </Typography>
            </Box>
          </Grid>

          {/* Returns (Absolute) */}
          <Grid size={{ xs: 12, sm: 4, md: 3, lg: 3, xl: 2 }}>
            <Box
              sx={{
                p: 2,
                border: 1,
                borderColor: "grey.300",
                borderRadius: 2,
                bgcolor: mode === "dark" ? "grey.800" : "grey.50",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: "medium" }}
              >
                Absolute Return
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold" }}
                color={data.absoluteReturn >= 0 ? "success.main" : "error.main"}
              >
                {data.absoluteReturn.toFixed(2)}%
              </Typography>
            </Box>
          </Grid>

          {/* Returns (XIRR) */}
          <Grid size={{ xs: 12, sm: 4, md: 3, lg: 3, xl: 2 }}>
            <Box
              sx={{
                p: 2,
                border: 1,
                borderColor: "grey.300",
                borderRadius: 2,
                bgcolor: mode === "dark" ? "grey.800" : "grey.50",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: "medium" }}
              >
                XIRR
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold" }}
                color={data.xirr >= 0 ? "success.main" : "error.main"}
              >
                {data.xirr.toFixed(2)}%
              </Typography>
            </Box>
          </Grid>

          {/* Holdings Info */}
          <Grid size={{ xs: 12, sm: 4, md: 3, lg: 3, xl: 2 }}>
            <Box
              sx={{
                p: 2,
                border: 1,
                borderColor: "grey.300",
                borderRadius: 2,
                bgcolor: mode === "dark" ? "grey.800" : "grey.50",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: "medium" }}
              >
                Total Schemes
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {data.schemeCount}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 3, lg: 3, xl: 2 }}>
            <Box
              sx={{
                p: 2,
                border: 1,
                borderColor: "grey.300",
                borderRadius: 2,
                bgcolor: mode === "dark" ? "grey.800" : "grey.50",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: "medium" }}
              >
                Total Folios
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {data.folioCount}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
