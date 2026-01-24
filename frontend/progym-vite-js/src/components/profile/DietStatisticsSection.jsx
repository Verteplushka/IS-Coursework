import React from "react";
import { Card, CardContent, Typography, Divider } from "@mui/material";

export default function DietStatisticsSection({ dietStats }) {
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
          <strong>Белки:</strong> {dietStats.totalProtein.toFixed(2)} г
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Жиры:</strong> {dietStats.totalFats.toFixed(2)} г
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Углеводы:</strong> {dietStats.totalCarbs.toFixed(2)} г
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Средняя калорийность за день:</strong>{" "}
          {dietStats.averageCaloriesPerDay.toFixed(2)}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Среднее количество приёмов пищи в день:</strong>{" "}
          {dietStats.averageMealsPerDay.toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  );
}
