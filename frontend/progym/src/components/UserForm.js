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
  Switch,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  ListSubheader,
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
    dietPreference: "",
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
    dietPreference: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // Для отслеживания загрузки
  const [submitStatus, setSubmitStatus] = useState(null); // Для статуса отправки (success/error)
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Для управления Snackbar

  useEffect(() => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Убираем время с учетом UTC
    const todayString = today.toISOString().split("T")[0]; // Преобразуем в формат yyyy-mm-dd

    setFormData((prevData) => ({
      ...prevData,
      startTraining: todayString,
    }));

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

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      axios
        .get("http://localhost:8080/api/user/get_user_params", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setFormData((prevData) => ({
            ...prevData,
            ...response.data,
          }));

          if (response.data.allergiesIds) {
            setSelectedAllergies(response.data.allergiesIds.map(String));
          }
        })
        .catch((err) => {
          console.error("Не удалось загрузить данные пользователя.", err);
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
    const { checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      dietPreference: checked ? "VEGETARIAN" : "OMNIVORE", // Устанавливаем соответствующее значение в dietPreference
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
      gender,
      height,
      currentWeight,
      goal,
      fitnessLevel,
      activityLevel,
      availableDays,
      startTraining,
      dietPreference,
    } = formData;

    let errors = {};

    // Проверка даты рождения
    const birthDateObj = new Date(birthDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const minBirthDate = new Date("1900-01-01");
    const maxBirthDate = new Date(currentDate);
    maxBirthDate.setFullYear(currentDate.getFullYear() - 7);

    if (!birthDate) {
      errors.birthDate = "Пожалуйста, укажите дату рождения.";
    } else if (birthDateObj > maxBirthDate) {
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
    const oneWeeksFromNow = new Date();
    oneWeeksFromNow.setDate(currentDate.getDate() + 6);
    const startTrainingObj = new Date(startTraining);
    startTrainingObj.setHours(0, 0, 0, 0);

    // Проверка
    if (!startTraining) {
      errors.startTraining = "Пожалуйста, укажите дату начала тренировок.";
    } else if (startTrainingObj < currentDate) {
      errors.startTraining = "Дата начала тренировок не может быть в прошлом.";
    } else if (startTrainingObj > oneWeeksFromNow) {
      errors.startTraining =
        "Дата начала тренировок должна быть в пределах ближайшей недели.";
    }

    if (!height) {
      errors.height = "Пожалуйста, укажите рост.";
    }

    if (!currentWeight) {
      errors.currentWeight = "Пожалуйста, укажите вес.";
    }

    if (!gender) {
      errors.gender = "Пожалуйста, выберите пол.";
    }

    if (!goal) {
      errors.goal = "Пожалуйста, выберите цель.";
    }

    if (!fitnessLevel) {
      errors.fitnessLevel = "Пожалуйста, выберите уровень подготовки.";
    }

    if (!activityLevel) {
      errors.activityLevel = "Пожалуйста, выберите уровень активности.";
    }

    if (!availableDays) {
      errors.availableDays = "Пожалуйста, укажите количество доступных дней.";
    }

    if (!dietPreference) {
      errors.dietPreference = "Пожалуйста, выберите приоритет в диете.";
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
      !startTraining ||
      !dietPreference
    ) {
      errors.general = "Пожалуйста, заполните все поля.";
    }

    // Если есть ошибки, отображаем их
    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true); // Начинаем загрузку
      setSubmitStatus(null); // Сбрасываем статус отправки

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
          setSubmitStatus("success"); // Устанавливаем статус успеха
          setSnackbarOpen(true); // Открываем Snackbar
        })
        .catch((err) => {
          console.error("Ошибка при сохранении данных.", err);
          setSubmitStatus("error"); // Устанавливаем статус ошибки
          setSnackbarOpen(true); // Открываем Snackbar
        })
        .finally(() => {
          setIsSubmitting(false); // Завершаем загрузку
        });
    }
  };

  return (
    <>
      <Header />

      <Container
        maxWidth="md"
        sx={{
          // minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt={4}
          // mb={4}
          // flex={1}
        >
          <Typography variant="h4">Заполните данные</Typography>
        </Box>
        <Grid container spacing={20}>
          {/* Левая колонка (форма) */}
          <Grid item xs={12} md={6}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt={8}
            >
              {validationErrors.general && (
                <Typography color="error">
                  {validationErrors.general}
                </Typography>
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
              <FormControl
                fullWidth
                margin="normal"
                error={!!validationErrors.gender}
              >
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
              <FormControl
                fullWidth
                margin="normal"
                error={!!validationErrors.goal}
              >
                <InputLabel>Цель</InputLabel>
                <Select
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  label="Цель"
                >
                  <MenuItem value="WEIGHT_LOSS">Похудеть</MenuItem>
                  <MenuItem value="MUSCLE_GAIN">
                    Набрать мышечную массу
                  </MenuItem>
                  <MenuItem value="MAINTENANCE">Поддержание веса</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Уровень подготовки</InputLabel>
                <Select
                  name="fitnessLevel"
                  value={formData.fitnessLevel}
                  onChange={handleChange}
                  label="Уровень подготовки"
                >
                  {/* Низкий уровень */}
                  <MenuItem value="1">
                    <Box>
                      <Typography>Низкий</Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontStyle: "italic", color: "text.secondary" }}
                      >
                        Новичок в зале
                      </Typography>
                    </Box>
                  </MenuItem>

                  {/* Средний уровень */}
                  <MenuItem value="2">
                    <Box>
                      <Typography>Средний</Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontStyle: "italic", color: "text.secondary" }}
                      >
                        Полгода - год в зале
                      </Typography>
                    </Box>
                  </MenuItem>

                  {/* Высокий уровень */}
                  <MenuItem value="3">
                    <Box>
                      <Typography>Высокий</Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontStyle: "italic", color: "text.secondary" }}
                      >
                        Более года в зале
                      </Typography>
                    </Box>
                  </MenuItem>
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
                  {/* Сидячий */}
                  <MenuItem value="1">
                    <Box>
                      <Typography>Сидячий</Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontStyle: "italic", color: "text.secondary" }}
                      >
                        Минимальная физическая активность (офисная работа)
                      </Typography>
                    </Box>
                  </MenuItem>

                  {/* Лёгкий */}
                  <MenuItem value="2">
                    <Box>
                      <Typography>Лёгкий</Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontStyle: "italic", color: "text.secondary" }}
                      >
                        Лёгкие тренировки 1-2 раза в неделю
                      </Typography>
                    </Box>
                  </MenuItem>

                  {/* Средний */}
                  <MenuItem value="3">
                    <Box>
                      <Typography>Средний</Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontStyle: "italic", color: "text.secondary" }}
                      >
                        Регулярные тренировки 3-4 раза в неделю
                      </Typography>
                    </Box>
                  </MenuItem>

                  {/* Активный */}
                  <MenuItem value="4">
                    <Box>
                      <Typography>Активный</Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontStyle: "italic", color: "text.secondary" }}
                      >
                        Интенсивные тренировки 5-6 раз в неделю
                      </Typography>
                    </Box>
                  </MenuItem>

                  {/* Очень активный */}
                  <MenuItem value="5">
                    <Box>
                      <Typography>Очень активный</Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontStyle: "italic", color: "text.secondary" }}
                      >
                        Профессиональный спорт или тяжёлая физическая работа
                      </Typography>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              {/* Поле для выбора доступных дней */}
              <FormControl
                fullWidth
                margin="normal"
                error={!!validationErrors.availableDays}
              >
                <InputLabel>Тренировок в неделю</InputLabel>
                <Select
                  name="availableDays"
                  value={formData.availableDays}
                  onChange={handleChange}
                  label="Тренировок в неделю"
                >
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="4">4</MenuItem>
                  <MenuItem value="5">5</MenuItem>
                  <MenuItem value="6">6</MenuItem>
                  <MenuItem value="7">7</MenuItem>
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

              {/* Переключатель для вегетарианца */}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
                mb={2}
              >
                <Typography variant="h6">Вегетарианец</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.dietPreference === "VEGETARIAN"} // Проверяем, является ли текущий выбор "VEGETARIAN"
                      onChange={handleCheckboxChange}
                      name="dietPreference"
                      color="primary"
                    />
                  }
                  label={
                    formData.dietPreference === "VEGETARIAN" ? "Да" : "Нет"
                  }
                  labelPlacement="end"
                  sx={{ marginLeft: 2 }}
                />
              </Box>
            </Box>
          </Grid>

          {/* Правая колонка (аллергии) */}
          <Grid item xs={12} md={6}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt={8}
            >
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
            </Box>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="center" width="100%" mt={3} mb={5}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Сохранить"
            )}
          </Button>
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={submitStatus === "success" ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {submitStatus === "success"
              ? "Данные успешно сохранены!"
              : "Ошибка при сохранении данных."}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default UserForm;