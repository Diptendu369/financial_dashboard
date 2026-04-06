import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { AppBar, Box, Button, IconButton, Toolbar, Typography, Avatar } from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onMenuClick, showMenu }) {
  const { user, logout } = useAuth();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "rgba(15, 23, 42, 0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)"
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        {showMenu && (
          <IconButton 
            color="inherit" 
            edge="start" 
            onClick={onMenuClick} 
            sx={{ 
              mr: 2,
              "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" }
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography 
          variant="h6" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 600,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}
        >
          Finance Dashboard
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", mr: 1 }}>
            <Typography
              variant="body2"
              sx={{ 
                display: { xs: "none", sm: "block" }, 
                opacity: 0.95,
                fontWeight: 600,
                lineHeight: 1.2
              }}
            >
              {user?.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{ 
                display: { xs: "none", sm: "block" }, 
                opacity: 0.8,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: 0.5
              }}
            >
              {user?.role}
            </Typography>
          </Box>
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40,
              bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              fontSize: "1rem",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)"
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <IconButton 
            color="inherit" 
            onClick={logout}
            sx={{
              "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" }
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
