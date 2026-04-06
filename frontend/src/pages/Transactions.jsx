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
  Stack,
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
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const emptyForm = { user_id: 1, amount: "", type: "expense", category: "", date: "", notes: "" };

export default function Transactions() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ type: "", category: "", search: "" });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const { user } = useAuth();

  const load = async () => {
    const { data } = await api.get("/transactions", { params: { ...filters, page: 1, limit: 10 } });
    setData(data);
  };

  useEffect(() => {
    load().catch(() => setError("Unable to fetch transactions"));
  }, []);

  const submit = async () => {
    if (editing) {
      await api.put(`/transactions/${editing.id}`, form);
    } else {
      await api.post("/transactions", form);
    }
    setOpen(false);
    setEditing(null);
    setForm(emptyForm);
    await load();
  };

  const remove = async (id) => {
    await api.delete(`/transactions/${id}`);
    await load();
  };

  const onFilter = async () => {
    await load();
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Transactions
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}

      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={2}
        mb={2}
        useFlexGap
        sx={{ alignItems: { xs: "stretch", lg: "center" } }}
      >
        <TextField select label="Type" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} sx={{ minWidth: 150 }}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </TextField>
        <TextField label="Category" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} />
        <TextField label="Search" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        <Button variant="outlined" onClick={onFilter}>
          Apply
        </Button>
        {user?.role === "admin" && (
          <Button variant="contained" onClick={() => setOpen(true)}>
            Add Transaction
          </Button>
        )}
      </Stack>

      <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 8px 24px rgba(15,23,42,0.08)" }}>
        <TableContainer sx={{ maxWidth: "100%", overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell>ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.user_id}</TableCell>
                  <TableCell>${Number(row.amount).toLocaleString()}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.notes}</TableCell>
                  <TableCell>
                    {user?.role === "admin" && (
                      <>
                        <Button
                          size="small"
                          onClick={() => {
                            setEditing(row);
                            setForm(row);
                            setOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button size="small" color="error" onClick={() => remove(row.id)}>
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "Edit Transaction" : "Create Transaction"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" label="User ID" value={form.user_id} onChange={(e) => setForm({ ...form, user_id: Number(e.target.value) })} />
          <TextField fullWidth margin="normal" label="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
          <TextField select fullWidth margin="normal" label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </TextField>
          <TextField fullWidth margin="normal" label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <TextField fullWidth margin="normal" type="date" label="Date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} InputLabelProps={{ shrink: true }} />
          <TextField fullWidth margin="normal" label="Notes" value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
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
