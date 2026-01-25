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
import { getCurrentUser } from "../api/user/User";
import { sendLogin } from "../api/auth/Auth";

const LoginPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await sendLogin(login, password);

      const accessToken = response.access_token;
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", response.refresh_token);

      const userResponseData = await getCurrentUser();
      const userRole = userResponseData.role;

      if (userRole === "ADMIN") {
        navigate("/CreateExercise");
      } else {
        navigate("/home");
      }
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
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
        >
          Войти
        </Button>
        <Box mt={2}>
          <Typography variant="body2" align="center">
            Нет аккаунта?{" "}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate("/register")}
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
