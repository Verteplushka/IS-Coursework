import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  Chip,
} from "@mui/material";
import axios from "axios";
import AdminHeader from "./AdminHeader";

const CreateAllergy = () => {
  const [formData, setFormData] = useState({
    name: "",
    allergyMealsIds: [],
  });
  const [meals, setMeals] = useState([]); // Все блюда
  const [searchQuery, setSearchQuery] = useState(""); // Поисковый запрос
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("access_token");

  // Загрузка всех блюд
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/general/get_all_meals", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMeals(res.data.meals))
      .catch((err) => console.error("Ошибка загрузки блюд", err));
  }, [token]);

  // Фильтрация блюд по поисковому запросу
  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMealChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      allergyMealsIds: value, // Обновляем список выбранных блюд
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/admin/add_allergy",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Аллергия успешно создана");
      setFormData({
        name: "",
        allergyMealsIds: [],
      });
    } catch (err) {
      setError("Ошибка при создании аллергии");
      console.error("Ошибка при создании аллергии", err);
    }
  };

  return (
    <>
      <AdminHeader />
      <Container
        maxWidth="sm"
        sx={{ mt: 4, p: 3, bgcolor: "#f5f5f5", borderRadius: 2, boxShadow: 3 }}
      >
        <Typography variant="h4" gutterBottom textAlign="center">
          Создание аллергии
        </Typography>
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Название аллергии"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />

          {/* Множественный выбор для блюд */}
          <FormControl fullWidth required>
            <InputLabel>Выберите блюда</InputLabel>
            <Select
              multiple
              value={formData.allergyMealsIds}
              onChange={handleMealChange}
              input={<OutlinedInput label="Выберите блюда" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((mealId) => {
                    const meal = meals.find((m) => m.id === mealId);
                    return meal ? (
                      <Chip key={mealId} label={`${meal.name}`} />
                    ) : null;
                  })}
                </Box>
              )}
            >
              {filteredMeals.map((meal) => (
                <MenuItem key={meal.id} value={meal.id}>
                  {meal.name} ({meal.calories} ккал)
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Создать аллергию
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default CreateAllergy;
