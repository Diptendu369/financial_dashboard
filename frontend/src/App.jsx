import { Box, CssBaseline, Toolbar, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { useAuth } from "./context/AuthContext";
import { Component as EtherealShadow } from "./components/ui/ethereal-shadow";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";

function ProtectedRoute({ children, allowedRoles }) {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function Layout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerWidth = 240;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", position: "relative" }}>
      <CssBaseline />
      
      {/* Ethereal Shadow Background */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          overflow: "hidden"
        }}
      >
        <EtherealShadow
          color="rgba(30, 58, 138, 0.8)"
          animation={{ scale: 100, speed: 75 }}
          noise={{ opacity: 0.4, scale: 1.3 }}
          sizing="cover"
          style={{
            width: "100%",
            height: "100%"
          }}
        />
      </Box>

      {/* Navigation */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Navbar onMenuClick={() => setMobileOpen((prev) => !prev)} showMenu={isMobile} />
        <Sidebar
          drawerWidth={drawerWidth}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          isMobile={isMobile}
        />
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          p: { xs: 2, md: 3 },
          position: "relative",
          zIndex: 1
        }}
      >
        <Toolbar />
        <Box 
          sx={{ 
            maxWidth: 1800, 
            mx: "auto",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(15px)",
            borderRadius: 4,
            boxShadow: "0 12px 48px rgba(0, 0, 0, 0.15)",
            p: 4,
            minHeight: "calc(100vh - 120px)"
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute allowedRoles={["admin", "analyst"]}>
            <Layout>
              <Transactions />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout>
              <Users />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
