import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const App = () => {
  return (
    <div>
      <Main />
    </div>
  );
};

const Main = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const menuItems = [
    { text: "Home", path: "/home" },
    { text: "Login", path: "/login" },
    { text: "Item 3", path: "/item3" },
    { text: "Item 4", path: "/item4" },
  ];

  return (
    <div>
      <IconButton onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 240,
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        <Box
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
          sx={{ width: 240 }}
        >
          <List>
            {menuItems.map((item, index) => (
              <ListItem
                button
                key={item.text}
                component="a"
                href={item.path}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#1976d2",
                    color: "#ffffff",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <div>
        <h2>เนื้อหาหน้าเพจที่จะแสดง</h2>
      </div>
    </div>
  );
};

export default App;
