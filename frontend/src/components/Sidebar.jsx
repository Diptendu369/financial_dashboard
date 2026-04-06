import { Drawer, List, ListItemButton, ListItemText, Toolbar, Box, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PeopleIcon from "@mui/icons-material/People";

const links = [
  { to: "/dashboard", label: "Dashboard", roles: ["admin", "analyst", "viewer"], icon: <DashboardIcon /> },
  { to: "/transactions", label: "Transactions", roles: ["admin", "analyst"], icon: <AccountBalanceIcon /> },
  { to: "/users", label: "Users", roles: ["admin"], icon: <PeopleIcon /> }
];

export default function Sidebar({ drawerWidth, mobileOpen, onClose, isMobile }) {
  const { user } = useAuth();
  const allowedLinks = links.filter((link) => link.roles.includes(user?.role || "viewer"));

  const drawerContent = (
    <>
      <Toolbar />
      <Box sx={{ p: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 3,
            fontWeight: 600,
            color: "white"
          }}
        >
          Navigation
        </Typography>
        <List sx={{ px: 0 }}>
          {allowedLinks.map((link) => (
            <ListItemButton
              key={link.to}
              component={NavLink}
              to={link.to}
              onClick={isMobile ? onClose : undefined}
              sx={{
                borderRadius: 2,
                mb: 1,
                px: 2,
                py: 1.5,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(102, 126, 234, 0.1)",
                  transform: "translateX(4px)"
                },
                "&.active": {
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                  "& .MuiListItemText-primary": { 
                    fontWeight: 600,
                    color: "white"
                  },
                  "& .MuiSvgIcon-root": {
                    color: "white"
                  }
                },
                "& .MuiListItemText-primary": {
                  color: "white"
                },
                "& .MuiSvgIcon-root": {
                  color: "white"
                }
              }}
            >
              <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
                {link.icon}
              </Box>
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { 
            width: drawerWidth, 
            boxSizing: "border-box",
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(12px)",
            borderRight: "1px solid rgba(255,255,255,0.1)"
          }
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { 
            width: drawerWidth, 
            boxSizing: "border-box",
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(12px)",
            borderRight: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "4px 0 20px rgba(0, 0, 0, 0.15)"
          }
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
