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
import { addDietDay } from "../api/general/DietDay";
import { getAllMeals } from "../api/general/Meals";
import { getDietTypes } from "../api/general/General";

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
  const [searches, setSearches] = useState({
    BREAKFAST: "",
    LUNCH: "",
    DINNER: "",
    SNACK: "",
  });


  useEffect(() => {
    if (!token) return;

    getAllMeals()
      .then((data) => setMeals(data.meals))
      .catch((err) => setError("Ошибка загрузки блюд"));

    getDietTypes()
      .then((data) => setDietTypes(data))
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
        meals.map((meal) => ({ ...meal, mealPosition: position })),
      ),
    };

    try {
      await addDietDay(requestData);
      setMessage("Диетический день успешно добавлен!");
    } catch (err) {
      setError("Ошибка при добавлении диетического дня");
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
          Добавление диетического дня
        </Typography>

        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        {token ? (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Название"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
            />

            <FormControl fullWidth required>
              <InputLabel>Тип диеты</InputLabel>
              <Select
                value={selectedDietType}
                onChange={(e) => setSelectedDietType(e.target.value)}
                input={<OutlinedInput label={"Тип диеты"} />}
              >
                <MenuItem value="">Выберите тип диеты</MenuItem>
                {dietTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {Object.keys(selectedMeals).map((position) => {
              const search = searches[position];

              const filteredMeals = meals.filter((meal) =>
                  meal.name.toLowerCase().includes(search.toLowerCase())
              );

              return (
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
                                return meal ? (
                                    <Chip
                                        key={mealId}
                                        label={`${meal.name} (${meal.calories} ккал)`}
                                    />
                                ) : null;
                              })}
                            </Box>
                        )}
                        MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
                    >
                      <Box sx={{ p: 1 }}>
                        <TextField
                            placeholder="Поиск..."
                            value={search}
                            onChange={(e) =>
                                setSearches((prev) => ({ ...prev, [position]: e.target.value }))
                            }
                            size="small"
                            fullWidth
                        />
                      </Box>

                      {filteredMeals.map((meal) => (
                          <MenuItem key={meal.id} value={meal.id}>
                            {meal.name} ({meal.calories} ккал)
                          </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
              );
            })}



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
