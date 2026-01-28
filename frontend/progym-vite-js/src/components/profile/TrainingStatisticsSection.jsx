import React from "react";
import { Card, CardContent, Typography, Divider, Box } from "@mui/material";

export default function TrainingStatisticsSection({ trainingStats }) {
  const getMotivationalMessage = () => {
    const percentage = trainingStats.completionPercentage;
    if (percentage >= 90)
      return "Ты просто машина! 💪 Продолжай в том же духе!";
    if (percentage >= 70) return "Отличный результат! Ты на верном пути! 🚀";
    if (percentage >= 50) return "Хороший старт! Но есть куда расти! 💥";
    return "Не сдавайся! Каждый шаг важен! 🌟";
  };

  return (
    <Card
      elevation={3}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 4 }}>
        <Typography variant="h5" gutterBottom>
          🏋️‍♂️ Статистика тренировок
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Всего тренировок:</strong> {trainingStats.totalTrainings}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Завершённых тренировок:</strong>{" "}
          {trainingStats.completedTrainings}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Процент завершения:</strong>{" "}
          {trainingStats.completionPercentage.toFixed(2)}%
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Среднее упражнений на тренировку:</strong>{" "}
          {trainingStats.averageExercisesPerTraining.toFixed(2)}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Общее количество выполненных упражнений:</strong>{" "}
          {trainingStats.totalCompletedExercises}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Кардио-упражнений:</strong>{" "}
          {trainingStats.cardioExercisesCount}
        </Typography>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography
            variant="h6"
            sx={{ fontStyle: "italic", color: "text.secondary" }}
          >
            {getMotivationalMessage()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
