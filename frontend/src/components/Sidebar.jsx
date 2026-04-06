import { Drawer, List, ListItemButton, ListItemText, Toolbar } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", roles: ["admin", "analyst", "viewer"] },
  { to: "/transactions", label: "Transactions", roles: ["admin", "analyst"] },
  { to: "/users", label: "Users", roles: ["admin"] }
];

export default function Sidebar({ drawerWidth, mobileOpen, onClose, isMobile }) {
  const { user } = useAuth();
  const allowedLinks = links.filter((link) => link.roles.includes(user?.role || "viewer"));

  const drawerContent = (
    <>
      <Toolbar />
      <List sx={{ px: 1 }}>
        {allowedLinks.map((link) => (
          <ListItemButton
            key={link.to}
            component={NavLink}
            to={link.to}
            onClick={isMobile ? onClose : undefined}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              "&.active": {
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "& .MuiListItemText-primary": { fontWeight: 700 }
              }
            }}
          >
            <ListItemText primary={link.label} />
          </ListItemButton>
        ))}
      </List>
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
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" }
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
            borderRight: "1px solid #e5e7eb",
            bgcolor: "#fff"
          }
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
