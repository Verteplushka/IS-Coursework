// src/components/Header.js
import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Avatar, Box } from "@mui/material";
import { AccountCircle, ExitToApp, Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Header = ({ userName }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    handleMenuClose();
  };

  const handleLogoutClick = () => {
    // Очистить токены и выйти из системы
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
    handleMenuClose();
  };

  const handleHomeClick = () => {
    navigate("/home"); // Переход на домашнюю страницу (или другую вкладку)
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box display="flex" alignItems="center" flexGrow={1}>
          <IconButton color="inherit" onClick={handleHomeClick}>
            <Home />
          </IconButton>
          <Typography variant="h6" noWrap>
            ProGym2004
          </Typography>
        </Box>

        {/* Имя пользователя и иконки */}
        <Box display="flex" alignItems="center">
          <Typography variant="body1" color="inherit" sx={{ mr: 2 }}>
            {userName}
          </Typography>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Avatar>{userName.charAt(0)}</Avatar>
          </IconButton>

          {/* Меню с профилем и выходом */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleProfileClick}>
              <AccountCircle sx={{ mr: 1 }} /> Профиль
            </MenuItem>
            <MenuItem onClick={handleLogoutClick}>
              <ExitToApp sx={{ mr: 1 }} /> Выйти
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
