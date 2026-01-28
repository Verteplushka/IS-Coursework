import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip,
} from "@mui/material";
import AdminHeader from "./AdminHeader";
import { getAllAllergies } from "../api/general/Allergies";
import { addMeal } from "../api/general/Meals";

const CreateMeal = () => {
  const [formData, setFormData] = useState({
    name: "",
    calories: "",
    protein: "",
    fats: "",
    carbs: "",
    allergiesIds: [],
  });

  const [errors, setErrors] = useState({
    name: "",
    calories: "",
    protein: "",
    fats: "",
    carbs: "",
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
      const data = await getAllAllergies();
      if (data && data.allergies) {
        const allergiesArray = Object.entries(data.allergies).map(
          ([id, name]) => ({
            id: parseInt(id),
            name,
          }),
        );
        setAllergies(allergiesArray);
      }
    } catch (err) {
      setError("Ошибка загрузки списка аллергий");
      console.error("Ошибка при загрузке аллергий", err);
    }
  };

  const validateForm = () => {
    let newErrors = {
      name: "",
      calories: "",
      protein: "",
      fats: "",
      carbs: "",
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Укажите название блюда";
      isValid = false;
    }

    const cal = Number(formData.calories);
    if (formData.calories === "") {
      newErrors.calories = "Укажите калории";
      isValid = false;
    } else if (cal < 0) {
      newErrors.calories = "Значение калорий должно быть неотрицательным";
      isValid = false;
    }

    const prot = Number(formData.protein);
    if (formData.protein === "") {
      newErrors.protein = "Укажите белки";
      isValid = false;
    } else if (prot < 0) {
      newErrors.protein = "Значение белков должно быть неотрицательным";
      isValid = false;
    }

    const fat = Number(formData.fats);
    if (formData.fats === "") {
      newErrors.fats = "Укажите жиры";
      isValid = false;
    } else if (fat < 0) {
      newErrors.fats = "Значение жиров должно быть неотрицательным";
      isValid = false;
    }

    const carb = Number(formData.carbs);
    if (formData.carbs === "") {
      newErrors.carbs = "Укажите углеводы";
      isValid = false;
    } else if (carb < 0) {
      newErrors.carbs = "Значение углеводов должно быть неотрицательным";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAllergyChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      allergiesIds: event.target.value,
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

    if (!validateForm()) {
      return;
    }

    try {
      await addMeal(formData);
      setMessage("Блюдо успешно добавлено");
      setFormData({
        name: "",
        calories: "",
        protein: "",
        fats: "",
        carbs: "",
        allergiesIds: [],
      });
      setErrors({});
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
      <Container
        maxWidth="sm"
        sx={{ mt: 4, p: 3, bgcolor: "#f5f5f5", borderRadius: 2, boxShadow: 3 }}
      >
        <Typography variant="h4" gutterBottom textAlign="center">
          Добавить блюдо
        </Typography>

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {token ? (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Название блюда"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
            />

            <TextField
              label="Калории (ккал)"
              name="calories"
              type="number"
              value={formData.calories}
              onChange={handleChange}
              fullWidth
              error={!!errors.calories}
              helperText={errors.calories}
            />

            <TextField
              label="Белки (г)"
              name="protein"
              type="number"
              value={formData.protein}
              onChange={handleChange}
              fullWidth
              error={!!errors.protein}
              helperText={errors.protein}
            />

            <TextField
              label="Жиры (г)"
              name="fats"
              type="number"
              value={formData.fats}
              onChange={handleChange}
              fullWidth
              error={!!errors.fats}
              helperText={errors.fats}
            />

            <TextField
              label="Углеводы (г)"
              name="carbs"
              type="number"
              value={formData.carbs}
              onChange={handleChange}
              fullWidth
              error={!!errors.carbs}
              helperText={errors.carbs}
            />

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
                      return allergy ? (
                        <Chip key={id} label={allergy.name} />
                      ) : null;
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

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Добавить блюдо
            </Button>
          </Box>
        ) : (
          <Typography textAlign="center" color="error">
            Токен не найден, перезайдите в систему.
          </Typography>
        )}
      </Container>
    </>
  );
};

export default CreateMeal;
