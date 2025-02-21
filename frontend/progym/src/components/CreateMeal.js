import { useState, useEffect } from "react";
import {
  Container, TextField, Button, Typography, Alert, Box, Select, MenuItem, InputLabel, FormControl, OutlinedInput, Chip
} from "@mui/material";
import axios from "axios";
import AdminHeader from "./AdminHeader";

const CreateMeal = () => {
  const [formData, setFormData] = useState({
    name: "",
    calories: "",
    protein: "",
    fats: "",
    carbs: "",
    allergiesIds: []
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [allergies, setAllergies] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (!storedToken) {
      setError("Ошибка: отсутствует токен аутентификации");
    } else {
      setToken(storedToken);
      fetchAllergies(storedToken);
    }
  }, []);

  const fetchAllergies = async (token) => {
    try {
      const response = await axios.get("http://localhost:8080/api/general/get_all_allergies", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data && response.data.allergies) {
        const allergiesArray = Object.entries(response.data.allergies).map(([id, name]) => ({
          id: parseInt(id),
          name
        }));
        setAllergies(allergiesArray);
      }
    } catch (err) {
      setError("Ошибка загрузки списка аллергий");
      console.error("Ошибка при загрузке аллергий", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name" && value.length > 50) {
      setError("Название блюда не должно превышать 50 символов");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAllergyChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      allergiesIds: event.target.value
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
        carbs: "",
        allergiesIds: []
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
            <TextField 
              label="Название блюда" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              fullWidth 
              required 
              inputProps={{ maxLength: 50 }} 
              helperText={formData.name.length > 50 ? "Максимальная длина — 50 символов" : ""}
            />
            <TextField label="Калории (ккал)" name="calories" type="number" value={formData.calories} onChange={handleChange} fullWidth required />
            <TextField label="Белки (г)" name="protein" type="number" value={formData.protein} onChange={handleChange} fullWidth required />
            <TextField label="Жиры (г)" name="fats" type="number" value={formData.fats} onChange={handleChange} fullWidth required />
            <TextField label="Углеводы (г)" name="carbs" type="number" value={formData.carbs} onChange={handleChange} fullWidth required />

            <FormControl fullWidth>
              <InputLabel>Аллергии</InputLabel>
              <Select
                multiple
                value={formData.allergiesIds}
                onChange={handleAllergyChange}
                input={<OutlinedInput label="Аллергии" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((id) => {
                      const allergy = allergies.find((a) => a.id === id);
                      return allergy ? <Chip key={id} label={allergy.name} /> : null;
                    })}
                  </Box>
                )}
              >
                {allergies.map((allergy) => (
                  <MenuItem key={allergy.id} value={allergy.id}>
                    {allergy.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
