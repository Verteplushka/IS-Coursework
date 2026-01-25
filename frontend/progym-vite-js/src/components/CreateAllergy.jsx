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
import AdminHeader from "./AdminHeader";
import { getAllMeals } from "../api/general/Meals";
import { addAllergy } from "../api/general/Allergies";

const CreateAllergy = () => {
  const [formData, setFormData] = useState({
    name: "",
    allergyMealsIds: [],
  });
  const [meals, setMeals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) return;
    getAllMeals()
        .then((data) => setMeals(data.meals))
        .catch((err) => console.error("Ошибка загрузки блюд", err));
  }, [token]);

  // Фильтруем блюда по поисковому запросу
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
      allergyMealsIds: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await addAllergy(formData);
      setMessage("Аллергия успешно создана");
      setFormData({
        name: "",
        allergyMealsIds: [],
      });
      setSearchQuery(""); // очищаем поиск после создания
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

            {/* Поле для поиска блюд */}
            <TextField
                label="Поиск блюд"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
            />

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
                          return meal ? <Chip key={mealId} label={meal.name} /> : null;
                        })}
                      </Box>
                  )}
              >
                {filteredMeals.map((meal) => (
                    <MenuItem key={meal.id} value={meal.id}>
                      {meal.name}
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
