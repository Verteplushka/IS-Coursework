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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);
import {
  getTrainingStatistics,
  getDietStatistics,
  getWeightProgress,
} from "../api/user/Statistics";

const Profile = () => {
  const [trainingStats, setTrainingStats] = useState(null);
  const [dietStats, setDietStats] = useState(null);
  const [weightProgress, setWeightProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchStatistics = async () => {
      if (!token) {
        console.error("Токен отсутствует");
        return;
      }

      try {
        const trainingData = await getTrainingStatistics();
        const dietData = await getDietStatistics();
        const weightData = await getWeightProgress();

        console.log(trainingData, dietData, weightData);

        setTrainingStats(trainingData);
        setDietStats(dietData);
        setWeightProgress(weightData);
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

  if (!trainingStats || !dietStats || !weightProgress) {
    return <Typography sx={{ p: 4 }}>Ошибка загрузки статистики.</Typography>;
  }

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

  const getWeightMotivation = () => {
    const weightChanges = weightProgress.weights;
    const latestWeight = weightChanges[weightChanges.length - 1].weight;
    const previousWeight = weightChanges[weightChanges.length - 2]?.weight;

    if (!previousWeight)
      return "Записывай изменения веса, и тут появится график! 🚀";

    if (latestWeight < previousWeight) {
      return `Красава! Ты скинул ${Math.abs(
        previousWeight - latestWeight,
      ).toFixed(2)} кг! 💪 Продолжай в том же духе!`;
    } else if (latestWeight > previousWeight) {
      return `Ооо, немного набрал вес. Все будет ок, главное не сдаваться! 🚀 Следующий шаг - сбросить это!`;
    } else {
      return "Вес стабильный, продолжай двигаться вперед! 🌱";
    }
  };

  const weightDates = weightProgress.weights.map((entry) => entry.weightDate);
  const weightValues = weightProgress.weights.map((entry) => entry.weight);

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
                  <strong>Белки:</strong> {dietStats.totalProtein.toFixed(2)}{" "}
                  г{" "}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Жиры:</strong> {dietStats.totalFats.toFixed(2)} г{" "}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Углеводы:</strong> {dietStats.totalCarbs.toFixed(2)}{" "}
                  г{" "}
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
