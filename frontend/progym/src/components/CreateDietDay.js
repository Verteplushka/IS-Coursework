import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";

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

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/general/get_all_meals", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMeals(res.data.meals))
      .catch((err) => console.error("Ошибка загрузки блюд", err));

    axios
      .get("http://localhost:8080/api/general/get_diet_types", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDietTypes(res.data))
      .catch((err) => console.error("Ошибка загрузки типов диет", err));
  }, [token]);

  const handleAddMeal = (position, mealId, portionSize) => {
    setSelectedMeals((prev) => ({
      ...prev,
      [position]: [...prev[position], { id: mealId, portionSize }],
    }));
  };

  const handleSubmit = () => {
    const requestData = {
      name,
      dietType: selectedDietType,
      meals: Object.entries(selectedMeals).flatMap(([position, meals]) =>
        meals.map((meal) => ({ ...meal, mealPosition: position }))
      ),
    };

    axios
      .post("http://localhost:8080/api/admin/add_diet_day", requestData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => alert("Диетический день добавлен!"))
      .catch((err) => console.error("Ошибка при добавлении", err));
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Добавление диетического дня</h2>
      <TextField
        fullWidth
        label="Название"
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Тип диеты</InputLabel>
        <Select
          value={selectedDietType}
          onChange={(e) => setSelectedDietType(e.target.value)}
        >
          <MenuItem value="">Выберите тип диеты</MenuItem>
          {dietTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {Object.keys(selectedMeals).map((position) => (
        <div key={position} className="mt-4">
          <h3 className="text-lg font-semibold">{position}</h3>
          <FormControl fullWidth>
            <InputLabel>Выберите блюдо</InputLabel>
            <Select
              onChange={(e) => handleAddMeal(position, e.target.value, 100)}
            >
              <MenuItem value="">Выберите блюдо</MenuItem>
              {meals.map((meal) => (
                <MenuItem key={meal.id} value={meal.id}>
                  {meal.name} ({meal.calories} ккал)
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ))}

      <Button
        variant="contained"
        color="primary"
        className="mt-4"
        onClick={handleSubmit}
      >
        Добавить
      </Button>
    </div>
  );
};

export default AddDietDay;
