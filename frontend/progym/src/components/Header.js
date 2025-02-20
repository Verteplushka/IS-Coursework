import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
} from "@mui/material";
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

  const handleUserFormClick = () => {
    navigate("/userform");
  };

  const handleHistoryClick = () => {
    navigate("/history");
  };

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ paddingRight: 0 }}>
        {" "}
        {/* Убираем лишний отступ справа */}
        <Box display="flex" alignItems="center">
          <IconButton color="inherit" onClick={handleHomeClick}>
            <Home />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            ProGym2004
          </Typography>
        </Box>
        {/* Меню навигации: ссылки по центру */}
        <Box
          display="flex"
          alignItems="center"
          flexGrow={1}
          justifyContent="center"
          sx={{ gap: 10 }} // Это задает равномерные промежутки между элементами
        >
          <IconButton color="inherit" onClick={handleUserFormClick}>
            <Typography variant="body1" color="inherit">
              Изменить данные
            </Typography>
          </IconButton>

          <IconButton color="inherit" onClick={handleHistoryClick}>
            <Typography variant="body1" color="inherit">
              История
            </Typography>
          </IconButton>
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
