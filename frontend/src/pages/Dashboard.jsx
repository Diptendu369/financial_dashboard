import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import api from "../services/api";

const COLORS = ["#1976d2", "#2e7d32", "#ed6c02", "#d32f2f", "#9c27b0"];

export default function Dashboard() {
  const [summary, setSummary] = useState({ total_income: 0, total_expense: 0, net_balance: 0 });
  const [monthly, setMonthly] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/dashboard/summary"), api.get("/dashboard/category-summary"), api.get("/dashboard/monthly-trend")]).then(
      ([s, c, m]) => {
        setSummary(s.data);
        setIncomeCategories(c.data.income_categories || []);
        setExpenseCategories(c.data.expense_categories || []);
        setMonthly(m.data.monthly);
      }
    );
  }, []);

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight={700} sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          Financial Dashboard Overview
        </Typography>
      </Stack>

      {/* Summary Cards with Descriptions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={600} mb={2} color="text.secondary">
          📊 Financial Summary - Your complete financial picture at a glance
        </Typography>
        <Grid container spacing={3}>
          {[
            {
              label: "Total Income",
              value: summary.total_income,
              description: "All revenue streams and earnings this period",
              color: "#10b981",
              icon: "💰"
            },
            {
              label: "Total Expense", 
              value: summary.total_expense,
              description: "Complete breakdown of all expenditures and costs",
              color: "#ef4444",
              icon: "💸"
            },
            {
              label: "Net Balance",
              value: summary.net_balance,
              description: "Your current financial position after all transactions",
              color: "#3b82f6",
              icon: "📈"
            }
          ].map((item) => (
            <Grid item xs={12} md={4} key={item.label}>
              <Card 
                sx={{ 
                  borderRadius: 4, 
                  boxShadow: "0 12px 40px rgba(15,23,42,0.12)",
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 20px 60px rgba(15,23,42,0.2)"
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography variant="h3" sx={{ mr: 2 }}>{item.icon}</Typography>
                    <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
                      {item.label}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="h4" 
                    fontWeight={700} 
                    sx={{ 
                      color: item.color,
                      mb: 1
                    }}
                  >
                    ${Number(item.value).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Charts Section with Descriptions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={600} mb={2} color="text.secondary">
          📈 Analytics & Insights - Deep dive into your financial patterns
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <Card 
              sx={{ 
                borderRadius: 4, 
                boxShadow: "0 12px 40px rgba(15,23,42,0.12)",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                height: "100%"
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" mb={1} fontWeight={600}>
                  🎯 Income Category Breakdown
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, opacity: 0.8 }}>
                  Understand where your money comes from
                </Typography>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie data={incomeCategories} dataKey="total" nameKey="category" outerRadius={120}>
                      {incomeCategories.map((entry, idx) => (
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
          <Grid item xs={12} md={6} lg={4}>
            <Card 
              sx={{ 
                borderRadius: 4, 
                boxShadow: "0 12px 40px rgba(15,23,42,0.12)",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                height: "100%"
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" mb={1} fontWeight={600}>
                  🎯 Expense Category Breakdown
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, opacity: 0.8 }}>
                  Track where your money is being spent
                </Typography>
                <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={expenseCategories} dataKey="total" nameKey="category" outerRadius={120}>
                    {expenseCategories.map((entry, idx) => (
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
        <Grid item xs={12} lg={4}>
          <Card 
            sx={{ 
              borderRadius: 4, 
              boxShadow: "0 12px 40px rgba(15,23,42,0.12)",
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              height: "100%"
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" mb={1} fontWeight={600}>
                📊 Income Trend (Monthly)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, opacity: 0.8 }}>
                  Monitor your income patterns over time
                </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={monthly}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      </Box>

      {/* Monthly Trends Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={600} mb={2} color="text.secondary">
          📅 Monthly Trends - Track your financial performance over time
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card 
              sx={{ 
                borderRadius: 4, 
                boxShadow: "0 12px 40px rgba(15,23,42,0.12)",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)"
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" mb={1} fontWeight={600}>
                  📊 Expense Trend (Monthly)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, opacity: 0.8 }}>
                  Analyze your spending patterns throughout the year
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={monthly}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="expense" fill="#dc2626" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
