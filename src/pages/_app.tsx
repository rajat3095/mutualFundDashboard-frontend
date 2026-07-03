import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../store";
import { CustomThemeProvider } from "../context/ThemeContext";
import { Box } from "@mui/material";
import Header from "@/components/common/Header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <CustomThemeProvider>
        {/* Global Page Wrapper */}
        <Box
          sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
        >
          {/* Global Header */}
          <Header />

          {/* The Current Page */}
          <Box component="main" sx={{ flexGrow: 1, width: "100%" }}>
            <Component {...pageProps} />
          </Box>
        </Box>
      </CustomThemeProvider>
    </Provider>
  );
}
