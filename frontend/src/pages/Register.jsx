import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import { Alert, Box, Button, Container, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "viewer" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/register", form);
      login(data.access_token, data.refresh_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.detail?.message || "Register failed");
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
          "radial-gradient(circle at 15% 15%, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0) 35%), radial-gradient(circle at 80% 80%, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0) 40%)"
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
            <PersonAddAltOutlinedIcon color="primary" />
            <Typography variant="h5" fontWeight={700}>
              Create account
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Register to start tracking your finance data.
          </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={submit}>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
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
          <TextField
            select
            fullWidth
            label="Role"
            margin="normal"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <MenuItem value="viewer">Viewer</MenuItem>
            <MenuItem value="analyst">Analyst</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Create account
          </Button>
          <Button component={Link} to="/login" fullWidth sx={{ mt: 1 }} variant="text">
            Back to login
          </Button>
        </Box>
        </Paper>
      </Container>
    </Box>
  );
}
