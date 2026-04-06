import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../services/api";

const defaultForm = { name: "", email: "", password: "", role: "viewer", status: "active" };

export default function Users() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);

  const load = async () => {
    const { data } = await api.get("/users", { params: { page: 1, limit: 20 } });
    setData(data);
  };

  useEffect(() => {
    load().catch(() => setError("Unable to fetch users"));
  }, []);

  const submit = async () => {
    if (editing) await api.put(`/users/${editing.id}`, form);
    else await api.post("/users", form);
    setOpen(false);
    setEditing(null);
    setForm(defaultForm);
    await load();
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>
        User Management
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Create User
      </Button>
      <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 8px 24px rgba(15,23,42,0.08)" }}>
        <TableContainer sx={{ maxWidth: "100%", overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => {
                        setEditing(row);
                        setForm({ ...row, password: "" });
                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      onClick={() =>
                        api
                          .patch(`/users/${row.id}/status`, {
                            status: row.status === "active" ? "inactive" : "active"
                          })
                          .then(load)
                      }
                    >
                      Toggle Status
                    </Button>
                    <Button size="small" color="error" onClick={() => api.delete(`/users/${row.id}`).then(load)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "Update User" : "Create User"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField fullWidth margin="normal" label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <TextField fullWidth margin="normal" type="password" label="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <TextField select fullWidth margin="normal" label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="analyst">Analyst</MenuItem>
            <MenuItem value="viewer">Viewer</MenuItem>
          </TextField>
          <TextField select fullWidth margin="normal" label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
