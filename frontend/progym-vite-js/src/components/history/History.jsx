import React, { useState, useEffect } from "react";
import { Container, Grid } from "@mui/material";
import Header from "../Header";
import { getTrainingHistory, getDietHistory } from "../../api/user/history";

import TrainingHistorySection from "./TrainingHistorySection";
import DietHistorySection from "./DietHistorySection";

const History = () => {
  const [trainingHistory, setTrainingHistory] = useState([]);
  const [dietHistory, setDietHistory] = useState([]);
  const [expandedTraining, setExpandedTraining] = useState(null);
  const [expandedDiet, setExpandedDiet] = useState(null);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) return;

    getTrainingHistory()
      .then((data) => {
        if (data?.trainings && Array.isArray(data.trainings)) {
          setTrainingHistory(data.trainings);
        }
      })
      .catch(console.error);

    getDietHistory()
      .then((data) => {
        if (data?.dietDays && Array.isArray(data.dietDays)) {
          setDietHistory(data.dietDays);
        }
      })
      .catch(console.error);
  }, [token]);

  return (
    <>
      <Header userName="Иван" />

      <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TrainingHistorySection
              trainingHistory={trainingHistory}
              expandedIndex={expandedTraining}
              onToggle={setExpandedTraining}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <DietHistorySection
              dietHistory={dietHistory}
              expandedIndex={expandedDiet}
              onToggle={setExpandedDiet}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default History;
