import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  Box,
  Divider,
  Grid,
  Button,  // Импортируем кнопку для регенерации
} from "@mui/material";
import Header from "./Header";

const HomePage = () => {
  const [diet, setDiet] = useState(null);
  const [training, setTraining] = useState(null);
  const token = localStorage.getItem("access_token");

  // Функция для обновления диеты
  const regenerateDiet = () => {
    fetch("http://localhost:8080/api/user/regenerate_today_diet", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => fetchDiet())
      .catch(console.error);
  };

  // Функция для обновления тренировки
  const regenerateTraining = () => {
    fetch("http://localhost:8080/api/user/regenerate_today_training", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => fetchTraining())
      .catch(console.error);
  };

  // Запрашиваем данные о диете
  const fetchDiet = () => {
    fetch("http://localhost:8080/api/user/get_today_diet", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setDiet)
      .catch(console.error);
  };

  // Запрашиваем данные о тренировке
  const fetchTraining = () => {
    fetch("http://localhost:8080/api/user/get_today_training", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setTraining)
      .catch(console.error);
  };

  useEffect(() => {
    if (!token) return;

    fetchDiet();
    fetchTraining();
  }, [token]);

  // Группируем приемы пищи по категориям
  const mealGroups = diet
    ? diet.meals.reduce((acc, meal) => {
        if (!acc[meal.mealPosition]) {
          acc[meal.mealPosition] = [];
        }
        acc[meal.mealPosition].push(meal);
        return acc;
      }, {})
    : {};

  const mealTitles = {
    BREAKFAST: "Завтрак",
    LUNCH: "Обед",
    DINNER: "Ужин",
    SNACK: "Перекус",
  };

  return (
    <>
      <Header userName="Иван" />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Блок с тренировкой */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Сегодняшняя тренировка
                </Typography>
                {training && training.exercises.length > 0 ? (
                  <List>
                    {training.exercises.map((exercise) => (
                      <ListItem key={exercise.id} sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                          {exercise.name} ({exercise.muscleGroup})
                        </Typography>
                        <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                          {exercise.description}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Инструкция:</strong> {exercise.execution_instructions}
                        </Typography>
                        {exercise.sets && exercise.repetitions ? (
                          <Typography variant="body2">
                            Подходы: {exercise.sets}, Повторения: {exercise.repetitions}
                          </Typography>
                        ) : (
                          <Typography variant="body2" sx={{ color: "gray" }}>
                            Количество повторений не задано, делайте по ощущениям
                          </Typography>
                        )}
                        <Divider sx={{ my: 1, width: "100%" }} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography sx={{ fontStyle: "italic", color: "gray" }}>
                    Сегодня тренировки нет, можешь отдохнуть! Может, устроишь
                    себе чиловый вечер с фильмом и вкусной едой? 🍕🎬
                  </Typography>
                )}
                <Button onClick={regenerateTraining} variant="contained" sx={{ mt: 2 }}>
                  Обновить тренировку
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Блок с диетой */}
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3, p: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Сегодняшняя диета
                </Typography>
                {diet ? (
                  <>
                    <Typography variant="h6" color="primary">
                      {diet.name}
                    </Typography>
                    <Typography variant="body1">
                      Калории: {diet.calories.toFixed(2)} ккал
                    </Typography>
                    <Typography variant="body1">
                      Белки: {diet.protein.toFixed(2)} г
                    </Typography>
                    <Typography variant="body1">
                      Жиры: {diet.fats.toFixed(2)} г
                    </Typography>
                    <Typography variant="body1">
                      Углеводы: {diet.carbs.toFixed(2)} г
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    {Object.keys(mealGroups).map((key) => (
                      <Box key={key} sx={{ mb: 2 }}>
                        <Typography variant="h6" sx={{ color: "#3f51b5" }}>
                          {mealTitles[key]}
                        </Typography>
                        <List>
                          {mealGroups[key].map((meal) => (
                            <ListItem
                              key={meal.id}
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "start",
                              }}
                            >
                              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                {meal.name}
                              </Typography>
                              <Typography variant="body2">
                                Порция: {meal.portionSize.toFixed(2)} г
                              </Typography>
                              <Typography variant="body2">
                                Калории: {meal.calories.toFixed(2)} ккал
                              </Typography>
                              <Typography variant="body2">
                                Белки: {meal.protein.toFixed(2)} г
                              </Typography>
                              <Typography variant="body2">
                                Жиры: {meal.fats.toFixed(2)} г
                              </Typography>
                              <Typography variant="body2">
                                Углеводы: {meal.carbs.toFixed(2)} г
                              </Typography>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    ))}
                  </>
                ) : (
                  <Typography>Загрузка данных о диете...</Typography>
                )}
                <Button onClick={regenerateDiet} variant="contained" sx={{ mt: 2 }}>
                  Обновить диету
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default HomePage;
