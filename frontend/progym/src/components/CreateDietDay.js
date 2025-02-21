import { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Alert,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  Chip,
  Button,
} from "@mui/material";
import axios from "axios";
import AdminHeader from "./AdminHeader";

const AddDietDay = () => {
  const [name, setName] = useState("");
  const [dietTypes, setDietTypes] = useState([]);
  const [selectedDietType, setSelectedDietType] = useState("");
  const [meals, setMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState({
    BREAKFAST: [],
    LUNCH: [],
    DINNER: [],
    SNACK: [],
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:8080/api/general/get_all_meals", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMeals(res.data.meals))
      .catch((err) => setError("Ошибка загрузки блюд"));

    axios
      .get("http://localhost:8080/api/general/get_diet_types", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDietTypes(res.data))
      .catch((err) => setError("Ошибка загрузки типов диет"));
  }, [token]);

  const handleMealChange = (position, selectedIds) => {
    setSelectedMeals((prev) => ({
      ...prev,
      [position]: selectedIds.map((id) => ({ id, portionSize: 100 })),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const requestData = {
      name,
      dietType: selectedDietType,
      meals: Object.entries(selectedMeals).flatMap(([position, meals]) =>
        meals.map((meal) => ({ ...meal, mealPosition: position }))
      ),
    };

    try {
      await axios.post("http://localhost:8080/api/admin/add_diet_day", requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Диетический день успешно добавлен!");
    } catch (err) {
      setError("Ошибка при добавлении диетического дня");
    }
  };

  return (
    <>
      <AdminHeader />
      <Container maxWidth="sm" sx={{ mt: 4, p: 3, bgcolor: "#f5f5f5", borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Добавление диетического дня
        </Typography>

        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        {token ? (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Название"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
            />

            <FormControl fullWidth required>
              <InputLabel>Тип диеты</InputLabel>
              <Select value={selectedDietType} onChange={(e) => setSelectedDietType(e.target.value)}>
                <MenuItem value="">Выберите тип диеты</MenuItem>
                {dietTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {Object.keys(selectedMeals).map((position) => (
              <FormControl key={position} fullWidth>
                <InputLabel>{position}</InputLabel>
                <Select
                  multiple
                  value={selectedMeals[position].map((meal) => meal.id)}
                  onChange={(e) => handleMealChange(position, e.target.value)}
                  input={<OutlinedInput label={position} />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((mealId) => {
                        const meal = meals.find((m) => m.id === mealId);
                        return meal ? <Chip key={mealId} label={`${meal.name} (${meal.calories} ккал)`} /> : null;
                      })}
                    </Box>
                  )}
                >
                  {meals.map((meal) => (
                    <MenuItem key={meal.id} value={meal.id}>
                      {meal.name} ({meal.calories} ккал)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Добавить
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

export default AddDietDay;
