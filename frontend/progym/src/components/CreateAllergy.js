import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Alert,
  Box,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from "@mui/material";
import axios from "axios";
import AdminHeader from "./AdminHeader";

const token = localStorage.getItem("access_token");
if (!token) {
  setError("Ошибка: отсутствует токен аутентификации");
  return;
}

const CreateAllergy = () => {
  const [formData, setFormData] = useState({
    name: "",
    allergyMealsIds: [],
  });

  const [meals, setMeals] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMeals = async () => {
      try {

        const response = await axios.get(
          "http://localhost:8080/api/general/get_all_meals",
          formData,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setMeals(response.data);
      } catch (err) {
        console.error("Ошибка при загрузке блюд", err);
      }
    };

    fetchMeals();
  }, []);

  const token = localStorage.getItem("access_token");
  if (token) {
    axios
      .get("api/general/get_all_allergies", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setAllergies(
          Object.entries(response.data.allergies).map(([id, name]) => ({
            id,
            name,
          }))
        );
      })
      .catch((err) => {
        console.error("Не удалось загрузить аллергии.", err);
      });
  }
}, [];


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (mealId) => {
    setFormData((prev) => {
      const newAllergyMealsIds = prev.allergyMealsIds.includes(mealId)
        ? prev.allergyMealsIds.filter((id) => id !== mealId)
        : [...prev.allergyMealsIds, mealId];
      return {
        ...prev,
        allergyMealsIds: newAllergyMealsIds,
      };
    });
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
          <Typography variant="h6" gutterBottom>
            Выберите блюда, которые вызывают аллергию:
          </Typography>
          <List>
            {meals.map((meal) => (
              <ListItem key={meal.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.allergyMealsIds.includes(meal.id)}
                      onChange={() => handleCheckboxChange(meal.id)}
                    />
                  }
                  label={meal.name}
                />
              </ListItem>
            ))}
          </List>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Создать аллергию
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default CreateAllergy;
