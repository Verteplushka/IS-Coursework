import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { sendRegister } from "../api/auth/Auth";

const RegistrationPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await sendRegister(login, password);
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("refresh_token", response.refresh_token);
      window.location.href = "/UserForm";
    } catch (err) {
      setError("Ошибка регистрации. Попробуйте снова.");
    }
  };

  const handleGoToLogin = () => {
    navigate("/");
  };

  return (
    <Container maxWidth="xs">
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <Typography variant="h4" gutterBottom>
          Регистрация
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
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleRegister}
        >
          Зарегистрироваться
        </Button>
        <Box mt={2}>
          <Typography variant="body2" color="textSecondary">
            Уже есть аккаунт?{" "}
            <Link href="#" onClick={handleGoToLogin} underline="hover">
              Войдите
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default RegistrationPage;
