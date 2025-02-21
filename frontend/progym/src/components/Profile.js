import React, { useEffect, useState } from "react";
import Header from "./Header";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Divider,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Регистрируем необходимые компоненты для Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Profile = () => {
  const [trainingStats, setTrainingStats] = useState(null);
  const [dietStats, setDietStats] = useState(null);
  const [weightProgress, setWeightProgress] = useState(null); // Состояние для веса
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchStatistics = async () => {
      if (!token) {
        console.error("Токен отсутствует");
        return;
      }

      try {
        const trainingResponse = await fetch(
          "http://localhost:8080/api/user/get_training_statistics",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const trainingData = await trainingResponse.json();

        const dietResponse = await fetch(
          "http://localhost:8080/api/user/get_diet_statistics",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const dietData = await dietResponse.json();

        // Новый запрос для получения прогресса по весу
        const weightResponse = await fetch(
          "http://localhost:8080/api/user/get_weight_progress",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const weightData = await weightResponse.json();

        setTrainingStats(trainingData);
        setDietStats(dietData);
        setWeightProgress(weightData); // Сохраняем прогресс по весу в состояние
      } catch (error) {
        console.error("Ошибка при загрузке статистики:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [token]);

  if (loading) {
    return (
      <Box sx={{ width: "100%", p: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  // Проверка на наличие данных перед их отображением
  if (!trainingStats || !dietStats || !weightProgress) {
    return <Typography sx={{ p: 4 }}>Ошибка загрузки статистики.</Typography>;
  }

  // Мотивационные речи
  const getMotivationalMessage = () => {
    const completionPercentage = trainingStats.completionPercentage;
    if (completionPercentage >= 90) {
      return "Ты просто машина! 💪 Продолжай в том же духе!";
    } else if (completionPercentage >= 70) {
      return "Отличный результат! Ты на верном пути! 🚀";
    } else if (completionPercentage >= 50) {
      return "Хороший старт! Но есть куда расти! 💥";
    } else {
      return "Не сдавайся! Каждый шаг важен! 🌟";
    }
  };

  // Проверка на null перед использованием weightProgress.weights
  if (
    !weightProgress ||
    !weightProgress.weights ||
    weightProgress.weights.length === 0
  ) {
    return (
      <>
        <Header />
        <Typography sx={{ p: 4, textAlign: "center" }}>
          Заполните форму и наслаждайтесь статистикой в профиле!
        </Typography>
      </>
    );
  }

  // Мотивация по прогрессу по весу
  const getWeightMotivation = () => {
    const weightChanges = weightProgress.weights;
    const latestWeight = weightChanges[weightChanges.length - 1].weight;
    const previousWeight = weightChanges[weightChanges.length - 2]?.weight;

    if (!previousWeight)
      return "Записывай изменения веса, и тут появится график! 🚀";

    if (latestWeight < previousWeight) {
      return `Красава! Ты скинул ${Math.abs(
        previousWeight - latestWeight
      ).toFixed(2)} кг! 💪 Продолжай в том же духе!`;
    } else if (latestWeight > previousWeight) {
      return `Ооо, немного набрал вес. Все будет ок, главное не сдаваться! 🚀 Следующий шаг - сбросить это!`;
    } else {
      return "Вес стабильный, продолжай двигаться вперед! 🌱";
    }
  };

  // Данные для графика
  const weightDates = weightProgress.weights.map((entry) => entry.weightDate);
  const weightValues = weightProgress.weights.map((entry) => entry.weight);

  // Данные для графика
  const data = {
    labels: weightDates,
    datasets: [
      {
        label: "Прогресс по весу (кг)",
        data: weightValues,
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* Мотивационная речь */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Твой прогресс
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontStyle: "italic", color: "text.secondary" }}
          >
            {getMotivationalMessage()}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Статистика тренировок */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  🏋️‍♂️ Статистика тренировок
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Всего тренировок:</strong>{" "}
                  {trainingStats.totalTrainings}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Завершённых тренировок:</strong>{" "}
                  {trainingStats.completedTrainings}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Процент завершения:</strong>{" "}
                  {trainingStats.completionPercentage.toFixed(2)}%{" "}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Среднее упражнений на тренировку:</strong>{" "}
                  {trainingStats.averageExercisesPerTraining.toFixed(2)}{" "}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Общее количество выполненных упражнений:</strong>{" "}
                  {trainingStats.totalCompletedExercises}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Кардио-упражнений:</strong>{" "}
                  {trainingStats.cardioExercisesCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Статистика питания */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  🍎 Статистика питания
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Дней на диете:</strong> {dietStats.totalDietDays}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Общее количество калорий:</strong>{" "}
                  {dietStats.totalCalories.toFixed(2)}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Белки:</strong> {dietStats.totalProtein.toFixed(2)} г{" "}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Жиры:</strong> {dietStats.totalFats.toFixed(2)} г{" "}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Углеводы:</strong> {dietStats.totalCarbs.toFixed(2)} г{" "}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Средняя калорийность за день:</strong>{" "}
                  {dietStats.averageCaloriesPerDay.toFixed(2)}{" "}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Среднее количество приёмов пищи в день:</strong>{" "}
                  {dietStats.averageMealsPerDay.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* График прогресса по весу */}
          <Grid item xs={12}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  ⚖️ Прогресс по весу
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Line data={data} />
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    sx={{ fontStyle: "italic", color: "text.secondary" }}
                  >
                    {getWeightMotivation()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Profile;
