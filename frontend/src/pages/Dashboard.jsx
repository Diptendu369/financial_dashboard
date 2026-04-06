import { Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "../services/api";

const COLORS = ["#1976d2", "#2e7d32", "#ed6c02", "#d32f2f", "#9c27b0"];

export default function Dashboard() {
  const [summary, setSummary] = useState({ total_income: 0, total_expense: 0, net_balance: 0 });
  const [categories, setCategories] = useState([]);
  const [monthly, setMonthly] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/dashboard/summary"), api.get("/dashboard/category-summary"), api.get("/dashboard/monthly-trend")]).then(
      ([s, c, m]) => {
        setSummary(s.data);
        setCategories(c.data.categories);
        setMonthly(m.data.monthly);
      }
    );
  }, []);

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={700}>
          Dashboard Overview
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        {[
          ["Total Income", summary.total_income],
          ["Total Expense", summary.total_expense],
          ["Net Balance", summary.net_balance]
        ].map(([label, value]) => (
          <Grid item xs={12} md={4} key={label}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 8px 24px rgba(15,23,42,0.08)" }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  {label}
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  ${Number(value).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 8px 24px rgba(15,23,42,0.08)" }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Category Breakdown
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={categories} dataKey="total" nameKey="category" outerRadius={100}>
                    {categories.map((entry, idx) => (
                      <Cell key={entry.category} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 8px 24px rgba(15,23,42,0.08)" }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Monthly Trend
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={monthly}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#2e7d32" />
                  <Line type="monotone" dataKey="expense" stroke="#d32f2f" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
