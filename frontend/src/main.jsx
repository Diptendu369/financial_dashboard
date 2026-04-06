import React from "react";
import ReactDOM from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

const theme = createTheme({
  palette: {
    primary: { main: "#2563eb" },
    background: { default: "#f6f8fb" }
  },
  shape: {
    borderRadius: 12
  },
  typography: {
    fontFamily: "Inter, Segoe UI, Roboto, Arial, sans-serif"
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
