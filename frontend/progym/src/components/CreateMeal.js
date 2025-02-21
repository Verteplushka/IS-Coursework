import { useState, useEffect } from "react";
import {
  Container, TextField, Button, Typography, Alert, Box
} from "@mui/material";
import axios from "axios";
import AdminHeader from "./AdminHeader";

const CreateMeal = () => {
  const [formData, setFormData] = useState({
    name: "",
    calories: "",
    protein: "",
    fats: "",
    carbs: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (!storedToken) {
      setError("Ошибка: отсутствует токен аутентификации");
    } else {
      setToken(storedToken);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("Ошибка: отсутствует токен аутентификации");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/admin/add_meal",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Блюдо успешно добавлено");
      setFormData({
        name: "",
        calories: "",
        protein: "",
        fats: "",
        carbs: ""
      });
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError("Ошибка 403: недостаточно прав для выполнения операции.");
      } else {
        setError("Ошибка при добавлении блюда");
      }
      console.error("Ошибка при добавлении блюда", err);
    }
  };

  return (
    <>
      <AdminHeader />
      <Container maxWidth="sm" sx={{ mt: 4, p: 3, bgcolor: "#f5f5f5", borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom textAlign="center">Добавить блюдо</Typography>
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        
        {token ? (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="Название блюда" name="name" value={formData.name} onChange={handleChange} fullWidth required />
            <TextField label="Калории (ккал)" name="calories" type="number" value={formData.calories} onChange={handleChange} fullWidth required />
            <TextField label="Белки (г)" name="protein" type="number" value={formData.protein} onChange={handleChange} fullWidth required />
            <TextField label="Жиры (г)" name="fats" type="number" value={formData.fats} onChange={handleChange} fullWidth required />
            <TextField label="Углеводы (г)" name="carbs" type="number" value={formData.carbs} onChange={handleChange} fullWidth required />
            <Button type="submit" variant="contained" color="primary" fullWidth>Добавить блюдо</Button>
          </Box>
        ) : (
          <Typography textAlign="center" color="error">Токен не найден, перезайдите в систему.</Typography>
        )}
      </Container>
    </>
  );
};

export default CreateMeal;
