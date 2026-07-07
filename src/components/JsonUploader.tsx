import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
  Stack,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

type JsonUploaderProps = {
  onSuccess?: () => void;
};

export default function JsonUploader({ onSuccess }: JsonUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "warning" | "info" | "";
    message: string;
  }>({ type: "", message: "" });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    if (selectedFile && selectedFile.type === "application/json") {
      setFile(selectedFile);
      setStatus({ type: "", message: "" });
    } else {
      setStatus({
        type: "error",
        message: "Please select a valid .json file.",
      });
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus({
        type: "warning",
        message: "Please select a JSON file first.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    console.log("Uploading file:", formData.get("file"));

    setStatus({ type: "info", message: "Uploading and parsing data..." });

    try {
      const response = await fetch(
        "http://localhost:5000/api/investors/createInvestors",
        {
          method: "POST",
          body: formData, // Browser sets the correct multipart boundary automatically
        },
      );

      // 1. Check the Content-Type header before parsing
      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        // If it's not JSON, read it as text so we can log the HTML error
        const textError = await response.text();
        console.error("Received non-JSON response:", textError);
        throw new TypeError("Oops, we haven't got JSON!");
      }

      // 2. Now it's safe to parse
      const result = await response.json();

      if (response.ok) {
        setStatus({ type: "success", message: `Success: ${result.message}` });
        // 3. Trigger the parent's close function after a short delay
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1500); // 1.5 second delay so the user sees the green alert
        }
      } else {
        setStatus({ type: "error", message: `Error: ${result.error}` });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Upload failed. The server did not return valid data.",
      });
      console.error("Fetch Error:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          boxShadow: 3,
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: "bold",
            }}
          >
            Import JSON to Database
          </Typography>

          <Stack spacing={3} sx={{ mt: 3 }}>
            {/* Native Hidden Input Wrapped in MUI Button */}
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{
                "&:hover": {
                  borderColor: "#6366f1",
                  backgroundColor: "rgba(99, 102, 241, 0.08)",
                },
                textTransform: "none",
                py: 1.5,
              }}
            >
              {file ? file.name : "Choose JSON File"}
              <input
                type="file"
                accept=".json"
                hidden
                onChange={handleFileChange}
              />
            </Button>

            <Button
              onClick={handleUpload}
              variant="contained"
              disabled={!file}
              sx={{
                backgroundColor: "#4f46e5",
                "&:hover": {
                  backgroundColor: "#4338ca",
                },
                textTransform: "none",
                py: 1.2,
                fontWeight: "medium",
              }}
            >
              Upload and Extract
            </Button>

            {status.message && (
              <Alert
                severity={status.type || "info"}
                variant="outlined"
                sx={{
                  mt: 2,
                  borderColor:
                    status.type === "success"
                      ? "#10b981"
                      : status.type === "error"
                        ? "#ef4444"
                        : "#4b5563",
                  "& .MuiAlert-icon": {
                    color:
                      status.type === "success"
                        ? "#10b981"
                        : status.type === "error"
                          ? "#ef4444"
                          : "#9ca3af",
                  },
                }}
              >
                {status.message}
              </Alert>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
