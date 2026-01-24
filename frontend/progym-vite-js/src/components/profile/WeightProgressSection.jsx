import React from "react";
import { Card, CardContent, Typography, Divider, Box } from "@mui/material";
import { Line } from "react-chartjs-2";

export default function WeightProgressSection({ weightProgress }) {
  const getWeightMotivation = () => {
    const weights = weightProgress.weights;
    if (weights.length < 2) {
      return "Записывай изменения веса, и тут появится график! 🚀";
    }

    const latest = weights[weights.length - 1].weight;
    const previous = weights[weights.length - 2].weight;

    if (latest < previous) {
      return `Красава! Ты скинул ${Math.abs(previous - latest).toFixed(
        2,
      )} кг! 💪 Продолжай в том же духе!`;
    }
    if (latest > previous) {
      return `Ооо, немного набрал вес. Всё будет ок, главное не сдаваться! 🚀`;
    }
    return "Вес стабильный, продолжай двигаться вперед! 🌱";
  };

  const dates = weightProgress.weights.map((e) => e.weightDate);
  const values = weightProgress.weights.map((e) => e.weight);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: "Прогресс по весу (кг)",
        data: values,
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
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
          ⚖️ Прогресс по весу
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            height: 400,
            width: "100%",
            position: "relative",
          }}
        >
          <Line
            data={chartData}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              plugins: {
                legend: { position: "top" },
              },
              scales: {
                x: {
                  ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                    autoSkip: true,
                  },
                },
              },
            }}
          />
        </Box>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography
            variant="h6"
            sx={{ fontStyle: "italic", color: "text.secondary" }}
          >
            {getWeightMotivation()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
