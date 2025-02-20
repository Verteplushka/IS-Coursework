import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Container, Grid, Card, CardContent, Typography } from "@mui/material";

const Profile = () => {
  const [trainingStats, setTrainingStats] = useState(null);
  const [dietStats, setDietStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchStatistics = async () => {
      if (!token) {
        console.error("Токен отсутствует");
        return;
      }

      try {
        const trainingResponse = await fetch("http://localhost:8080/api/user/get_training_statistics", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const trainingData = await trainingResponse.json();

        const dietResponse = await fetch("http://localhost:8080/api/user/get_diet_statistics", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const dietData = await dietResponse.json();

        setTrainingStats(trainingData);
        setDietStats(dietData);
      } catch (error) {
        console.error("Ошибка при загрузке статистики:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [token]);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  // Проверка на наличие данных перед их отображением
  if (!trainingStats || !dietStats) {
    return <p>Ошибка загрузки статистики.</p>;
  }

  return (
    <div>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Статистика тренировок */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Статистика тренировок
                </Typography>
                <p>Всего тренировок: {trainingStats.totalTrainings}</p>
                <p>Завершённых тренировок: {trainingStats.completedTrainings}</p>
                <p>Процент завершения: {trainingStats.completionPercentage}%</p>
                <p>Среднее упражнений на тренировку: {trainingStats.averageExercisesPerTraining}</p>
                <p>Общее количество выполненных упражнений: {trainingStats.totalCompletedExercises}</p>
                <p>Кардио-упражнений: {trainingStats.cardioExercisesCount}</p>
              </CardContent>
            </Card>
          </Grid>

          {/* Статистика питания */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Статистика питания
                </Typography>
                <p>Дней на диете: {dietStats.totalDietDays}</p>
                <p>Общее количество калорий: {dietStats.totalCalories}</p>
                <p>Белки: {dietStats.totalProtein} г</p>
                <p>Жиры: {dietStats.totalFats} г</p>
                <p>Углеводы: {dietStats.totalCarbs} г</p>
                <p>Средняя калорийность за день: {dietStats.averageCaloriesPerDay}</p>
                <p>Среднее количество приёмов пищи в день: {dietStats.averageMealsPerDay}</p>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Profile;
