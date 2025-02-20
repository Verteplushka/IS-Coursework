import React, { useState, useEffect } from "react";
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

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/api/general/get_user", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Ошибка ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setUser(data))
      .catch((error) => console.error("Ошибка загрузки пользователя:", error));
  }, [token]);

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
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
    handleMenuClose();
  };

  const handleHomeClick = () => {
    navigate("/home");
  };

  const handleUserFormClick = () => {
    navigate("/userform");
  };

  const handleTrainingHistoryClick = () => {
    navigate("/training-history");
  };

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ paddingRight: 0 }}>
        <Box display="flex" alignItems="center">
          <IconButton color="inherit" onClick={handleHomeClick}>
            <Home />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            ProGym2004
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" flexGrow={1} justifyContent="center">
          <IconButton color="inherit" onClick={handleUserFormClick}>
            <Typography variant="body1" color="inherit" sx={{ mr: 2 }}>
              Форма пользователя
            </Typography>
          </IconButton>

          <IconButton color="inherit" onClick={handleTrainingHistoryClick}>
            <Typography variant="body1" color="inherit" sx={{ mr: 2 }}>
              История тренировок
            </Typography>
          </IconButton>
        </Box>
        {user ? (
          <Box display="flex" alignItems="center">
            <Typography variant="body1" color="inherit" sx={{ mr: 2 }}>
              {user.name} {user.role === "ADMIN" && "(ADMIN)"}
            </Typography>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <Avatar>{user.name.charAt(0)}</Avatar>
            </IconButton>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleProfileClick}>
                <AccountCircle sx={{ mr: 1 }} /> Профиль
              </MenuItem>
              <MenuItem onClick={handleLogoutClick}>
                <ExitToApp sx={{ mr: 1 }} /> Выйти
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Typography variant="body1" color="inherit" sx={{ mr: 2 }}>
            Не авторизован
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
