// components/Header.tsx
import { useContext } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { ColorModeContext } from "../context/ThemeContext";

export default function Header() {
  const { toggleColorMode, mode } = useContext(ColorModeContext);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: mode === "dark" ? "grey.900" : "#ffffff",
        color: "text.primary",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          px: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <Typography variant="h5" component="h1" sx={{ fontWeight: "bold" }}>
          Mutual Fund Dashboard
        </Typography>

        <Button
          variant="outlined"
          color="inherit"
          onClick={toggleColorMode}
          startIcon={mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          sx={{ textTransform: "none" }}
        >
          {mode === "dark" ? "Light Mode" : "Dark Mode"}
        </Button>
      </Toolbar>
    </AppBar>
  );
}
