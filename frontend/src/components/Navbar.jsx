import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onMenuClick, showMenu }) {
  const { user, logout } = useAuth();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "rgba(15, 23, 42, 0.9)",
        backdropFilter: "blur(6px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)"
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        {showMenu && (
          <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Finance Dashboard
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="body2"
            sx={{ mr: 1, display: { xs: "none", sm: "block" }, opacity: 0.9 }}
          >
            Role: {user?.role || "N/A"}
          </Typography>
          <Button color="inherit" variant="outlined" onClick={logout} sx={{ borderColor: "rgba(255,255,255,0.3)" }}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
