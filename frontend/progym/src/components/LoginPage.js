import { useState } from "react";
import { Container, TextField, Button, Typography, Box, Link } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Используем useNavigate для перенаправления

const LoginPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Инициализируем navigate

  const handleLogin = async () => {
    try {
      const response = await axios.post("/api/auth/authenticate", {
        login,
        password,
      });
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      window.location.href = "/UserForm";
    } catch (err) {
      setError("Ошибка авторизации. Проверьте логин и пароль.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <Typography variant="h4" gutterBottom>
          Вход
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          label="Логин"
          variant="outlined"
          fullWidth
          margin="normal"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <TextField
          label="Пароль"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
          Войти
        </Button>
        <Box mt={2}>
          <Typography variant="body2" align="center">
            Нет аккаунта?{" "}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate("/register")} // Переход на страницу регистрации
            >
              Зарегистрироваться
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
