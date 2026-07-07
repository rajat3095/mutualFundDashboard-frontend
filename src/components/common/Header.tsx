// components/Header.tsx
import { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Dialog,
  Stack,
  Box,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { ColorModeContext } from "../../context/ThemeContext";
import JsonUploader from "../JsonUploader"; // Import the JsonUploader component
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function Header() {
  const { toggleColorMode, mode } = useContext(ColorModeContext);
  const [isUpload, setIsUpload] = useState(false);

  // Helper function to close the dialog
  const handleCloseDialog = () => {
    setIsUpload(false);
  };

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

        {/* <JsonUploader /> */}
        <Stack sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
          {/* Upload Button */}
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setIsUpload(true)}
            sx={{
              textTransform: "none",
              minWidth: { xs: "auto", sm: "64px" }, // Shrinks button on mobile
              px: { xs: 1.5, sm: 2 },
            }}
          >
            <CloudUploadIcon sx={{ mr: { xs: 0, sm: 1 } }} />
            <Box component="span" sx={{ display: { xs: "none", sm: "block" } }}>
              Upload JSON
            </Box>
          </Button>

          <Dialog
            open={isUpload}
            onClose={handleCloseDialog}
            aria-labelledby="json-uploader-title"
          >
            <JsonUploader onSuccess={handleCloseDialog} />
          </Dialog>

          {/* Theme Toggle Button */}
          <Button
            variant="outlined"
            color="inherit"
            onClick={toggleColorMode}
            sx={{
              textTransform: "none",
              minWidth: { xs: "auto", sm: "64px" }, // Shrinks button on mobile
              px: { xs: 1.5, sm: 2 },
            }}
          >
            {mode === "dark" ? (
              <LightModeIcon sx={{ mr: { xs: 0, sm: 1 } }} />
            ) : (
              <DarkModeIcon sx={{ mr: { xs: 0, sm: 1 } }} />
            )}
            <Box component="span" sx={{ display: { xs: "none", sm: "block" } }}>
              {mode === "dark" ? "Light Mode" : "Dark Mode"}
            </Box>
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
