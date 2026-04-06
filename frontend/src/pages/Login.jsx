import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { Alert, Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", form);
      login(data.access_token, data.refresh_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.detail?.message || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        bgcolor: "#f6f8fb",
        background:
          "radial-gradient(circle at 10% 20%, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0) 38%), radial-gradient(circle at 80% 80%, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0) 35%)"
      }}
    >
      <Container maxWidth="sm">
        <Paper
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            boxShadow: "0 16px 40px rgba(15,23,42,0.10)",
            border: "1px solid #e5e7eb"
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <AccountBalanceWalletOutlinedIcon color="primary" />
            <Typography variant="h5" fontWeight={700}>
              Welcome back
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Sign in to access your finance dashboard.
          </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={submit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            margin="normal"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Sign In
          </Button>
          <Button component={Link} to="/register" fullWidth sx={{ mt: 1 }} variant="text">
            Create an account
          </Button>
        </Box>
        </Paper>
      </Container>
    </Box>
  );
}
