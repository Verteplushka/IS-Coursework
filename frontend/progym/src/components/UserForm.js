import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import Header from "./Header"; // Импортируем шапку

const UserForm = () => {
  const [formData, setFormData] = useState({
    birthDate: "",
    gender: "",
    height: "",
    currentWeight: "",
    goal: "",
    fitnessLevel: "",
    activityLevel: "",
    availableDays: "",
    allergies: [],
    startTraining: "",
    isVegan: false,
    isVegetarian: false,
  });
  const [allergies, setAllergies] = useState([]);
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [validationErrors, setValidationErrors] = useState({
    birthDate: "",
    height: "",
    currentWeight: "",
    goal: "",
    fitnessLevel: "",
    activityLevel: "",
    availableDays: "",
    startTraining: "",
  });

  useEffect(() => {
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
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleAllergyChange = (e) => {
    const { value, checked } = e.target;
    setSelectedAllergies((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  const handleSubmit = () => {
    const {
      birthDate,
      height,
      currentWeight,
      goal,
      fitnessLevel,
      activityLevel,
      availableDays,
      startTraining,
    } = formData;

    let errors = {};

    // Проверка даты рождения
    const birthDateObj = new Date(birthDate);
    const currentDate = new Date();
    const minBirthDate = new Date("1900-01-01");
    const maxBirthDate = new Date(currentDate);
    maxBirthDate.setFullYear(currentDate.getFullYear() - 7);

    if (birthDateObj > maxBirthDate) {
      errors.birthDate = "Дата рождения должна быть более 7 лет назад.";
    } else if (birthDateObj < minBirthDate) {
      errors.birthDate = "Дата рождения не может быть раньше 1900-01-01.";
    }

    // Проверка роста
    const heightValue = parseInt(height);
    if (
      !Number.isInteger(heightValue) ||
      heightValue < 100 ||
      heightValue > 250
    ) {
      errors.height =
        "Рост должен быть целым числом в пределах от 100 до 250 см.";
    }

    // Проверка доступных дней
    const availableDaysValue = parseInt(availableDays);
    if (
      !Number.isInteger(availableDaysValue) ||
      availableDaysValue < 1 ||
      availableDaysValue > 7
    ) {
      errors.availableDays =
        "Количество доступных дней должно быть целым числом между 1 и 7.";
    }

    // Проверка веса
    const weightValue = parseInt(currentWeight);
    if (
      !Number.isInteger(weightValue) ||
      weightValue < 0 ||
      weightValue > 400
    ) {
      errors.currentWeight =
        "Вес должен быть целым числом в пределах от 0 до 400 кг.";
    }

    // Проверка даты начала тренировок
    const startTrainingObj = new Date(startTraining);
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(currentDate.getDate() + 14);

    if (startTrainingObj < currentDate) {
      errors.startTraining = "Дата начала тренировок не может быть в прошлом.";
    }

    if (startTrainingObj > twoWeeksFromNow) {
      errors.startTraining =
        "Дата начала тренировок должна быть в пределах ближайших 2 недель.";
    }

    // Проверка на обязательность заполнения всех полей
    if (
      !birthDate ||
      !gender ||
      !height ||
      !currentWeight ||
      !goal ||
      !fitnessLevel ||
      !activityLevel ||
      !availableDays ||
      !startTraining
    ) {
      errors.general = "Пожалуйста, заполните все поля.";
    }

    // Если есть ошибки, отображаем их
    setValidationErrors(errors);

    // Если ошибок нет, отправляем данные
    if (Object.keys(errors).length === 0) {
      const requestData = {
        ...formData,
        allergiesIds: selectedAllergies,
      };

      axios
        .post("/api/user/sendForm", requestData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then(() => {
          console.log("Данные сохранены успешно.");
          alert("Данные сохранены успешно.");
        })
        .catch((err) => {
          console.error("Ошибка при сохранении данных.", err);
        });
    }
  };

  return (
    <>
      <Header userName="Иван" />
      <Container maxWidth="xs">
        <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
          <Typography variant="h4" gutterBottom>
            Заполните данные
          </Typography>
          {validationErrors.general && (
            <Typography color="error">{validationErrors.general}</Typography>
          )}

          {/* Поле для даты рождения */}
          <TextField
            label="Дата рождения"
            variant="outlined"
            fullWidth
            margin="normal"
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            error={!!validationErrors.birthDate}
            helperText={validationErrors.birthDate}
          />

          {/* Поле для роста */}
          <TextField
            label="Рост (см)"
            variant="outlined"
            fullWidth
            margin="normal"
            name="height"
            value={formData.height}
            onChange={handleChange}
            error={!!validationErrors.height}
            helperText={validationErrors.height}
          />

          {/* Поле для веса */}
          <TextField
            label="Вес (кг)"
            variant="outlined"
            fullWidth
            margin="normal"
            name="currentWeight"
            value={formData.currentWeight}
            onChange={handleChange}
            error={!!validationErrors.currentWeight}
            helperText={validationErrors.currentWeight}
          />

          {/* Поле для выбора пола */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Пол</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              label="Пол"
            >
              <MenuItem value="MALE">Мужской</MenuItem>
              <MenuItem value="FEMALE">Женский</MenuItem>
            </Select>
          </FormControl>

          {/* Поле для выбора цели */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Цель</InputLabel>
            <Select
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              label="Цель"
            >
              <MenuItem value="WEIGHT_LOSS">Похудеть</MenuItem>
              <MenuItem value="MUSCLE_GAIN">Набрать мышечную массу</MenuItem>
              <MenuItem value="MAINTENANCE">Поддержание веса</MenuItem>
            </Select>
          </FormControl>

          {/* Поле для выбора уровня активности */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Уровень активности</InputLabel>
            <Select
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleChange}
              label="Уровень активности"
            >
              <MenuItem value="1">Сидячий</MenuItem>
              <MenuItem value="2">Легкий</MenuItem>
              <MenuItem value="3">Средний</MenuItem>
              <MenuItem value="4">Активный</MenuItem>
              <MenuItem value="5">Очень активный</MenuItem>
            </Select>
          </FormControl>

          {/* Поле для выбора доступных дней */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Доступные дни</InputLabel>
            <Select
              name="availableDays"
              value={formData.availableDays}
              onChange={handleChange}
              label="Доступные дни"
            >
              <MenuItem value="1">1 день</MenuItem>
              <MenuItem value="2">2 дня</MenuItem>
              <MenuItem value="3">3 дня</MenuItem>
              <MenuItem value="4">4 дня</MenuItem>
              <MenuItem value="5">5 дней</MenuItem>
              <MenuItem value="6">6 дней</MenuItem>
              <MenuItem value="7">7 дней</MenuItem>
            </Select>
          </FormControl>

          {/* Поле для начала тренировок */}
          <TextField
            label="Дата начала тренировок"
            variant="outlined"
            fullWidth
            margin="normal"
            name="startTraining"
            type="date"
            value={formData.startTraining}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            error={!!validationErrors.startTraining}
            helperText={validationErrors.startTraining}
          />

          {/* Чекбоксы для вегана/вегетарианца */}
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isVegan}
                  onChange={handleCheckboxChange}
                  name="isVegan"
                />
              }
              label="Веган"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isVegetarian}
                  onChange={handleCheckboxChange}
                  name="isVegetarian"
                />
              }
              label="Вегетарианец"
            />
          </FormGroup>

          {/* Чекбоксы для аллергий */}
          <Typography variant="h6" gutterBottom>
            Аллергии
          </Typography>
          <FormGroup>
            {allergies.map((allergy) => (
              <FormControlLabel
                key={allergy.id}
                control={
                  <Checkbox
                    value={allergy.id}
                    onChange={handleAllergyChange}
                    checked={selectedAllergies.includes(allergy.id)}
                  />
                }
                label={allergy.name}
              />
            ))}
          </FormGroup>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
          >
            Сохранить
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default UserForm;
