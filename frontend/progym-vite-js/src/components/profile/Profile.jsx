import React, { useEffect, useState } from "react";
import Header from "../Header";
import {
  Container,
  Grid,
  Box,
  Typography,
  LinearProgress,
} from "@mui/material";
import {
  getTrainingStatistics,
  getDietStatistics,
  getWeightProgress,
} from "../../api/user/Statistics";

import TrainingStatisticsSection from "./TrainingStatisticsSection";
import DietStatisticsSection from "./DietStatisticsSection";
import WeightProgressSection from "./WeightProgressSection";

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

const Profile = () => {
  const [trainingStats, setTrainingStats] = useState(null);
  const [dietStats, setDietStats] = useState(null);
  const [weightProgress, setWeightProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchStatistics = async () => {
      if (!token) return;

      try {
        const [trainingData, dietData, weightData] = await Promise.all([
          getTrainingStatistics(),
          getDietStatistics(),
          getWeightProgress(),
        ]);

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
    return (
      <Typography sx={{ p: 4, textAlign: "center" }}>
        Ошибка загрузки статистики
      </Typography>
    );
  }

  return (
    <div>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        <Box sx={{ mb: 5, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Твой прогресс
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <TrainingStatisticsSection trainingStats={trainingStats} />
          </Grid>

          <Grid item xs={12} md={6}>
            <DietStatisticsSection dietStats={dietStats} />
          </Grid>

          <Grid item xs={12} sx={{ mt: 6 }}>
            <WeightProgressSection weightProgress={weightProgress} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Profile;
