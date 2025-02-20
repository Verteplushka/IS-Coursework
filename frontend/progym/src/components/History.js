import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  IconButton,
  Grid,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import Header from "./Header";

const History = () => {
  const [trainingHistory, setTrainingHistory] = useState([]);
  const [dietHistory, setDietHistory] = useState([]);
  const [expandedTrainings, setExpandedTrainings] = useState([]); // Массив для хранения развернутых тренировок
  const [expandedDiets, setExpandedDiets] = useState([]); // Массив для хранения развернутых диет
  const token = localStorage.getItem("access_token");

  // Запрашиваем историю тренировок
  const fetchTrainingHistory = () => {
    fetch("http://localhost:8080/api/user/get_training_history", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Training History Data:", data);
        if (data.trainings && Array.isArray(data.trainings)) {
          setTrainingHistory(data.trainings);
        } else {
          console.error("Ошибка: данные о тренировках не являются массивом.");
        }
      })
      .catch((error) => {
        console.error("Ошибка при получении данных тренировки:", error);
      });
  };

  // Запрашиваем историю диет
  const fetchDietHistory = () => {
    fetch("http://localhost:8080/api/user/get_diet_history", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Diet History Data:", data);
        if (data.dietDays && Array.isArray(data.dietDays)) {
          setDietHistory(data.dietDays);
        } else {
          console.error("Ошибка: данные о диетах не являются массивом.");
        }
      })
      .catch((error) => {
        console.error("Ошибка при получении данных диеты:", error);
      });
  };

  useEffect(() => {
    if (!token) return;

    fetchTrainingHistory();
    fetchDietHistory();
  }, [token]);

  // Функции для разворачивания информации о тренировке и диете
  const toggleTraining = (id) => {
    setExpandedTrainings((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleDiet = (id) => {
    setExpandedDiets((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <>
      <Header userName="Иван" />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* История тренировок */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  История тренировок
                </Typography>
                {trainingHistory.length === 0 ? (
                  <Typography>Загрузка...</Typography>
                ) : (
                  <List>
                    {trainingHistory.map((training, idx) => (
                      <ListItem
                        key={idx}
                        sx={{
                          backgroundColor: training.completed ? "green" : "red",
                          color: "white",
                          marginBottom: "10px",
                          borderRadius: "8px",
                          padding: "10px",
                        }}
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          width="100%"
                        >
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold" }}
                          >
                            {`Тренировка от ${training.trainingDate}`}
                          </Typography>
                          <IconButton
                            onClick={() => toggleTraining(training.id)}
                            sx={{ color: "white" }}
                          >
                            {expandedTrainings.includes(training.id) ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )}
                          </IconButton>
                        </Box>
                        {expandedTrainings.includes(training.id) && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2">
                              <strong>Упражнения:</strong>
                            </Typography>
                            <List>
                              {training.exercises.map((exercise, index) => (
                                <ListItem key={index}>
                                  <Typography variant="body2">
                                    {exercise.name} ({exercise.muscleGroup})
                                  </Typography>
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* История диет */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  История диет
                </Typography>
                {dietHistory.length === 0 ? (
                  <Typography>Загрузка...</Typography>
                ) : (
                  <List>
                    {dietHistory.map((diet, idx) => (
                      <ListItem key={idx}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          width="100%"
                        >
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold" }}
                          >
                            {diet.name}
                          </Typography>
                          <IconButton
                            onClick={() => toggleDiet(diet.id)}
                            sx={{ color: "black" }}
                          >
                            {expandedDiets.includes(diet.id) ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )}
                          </IconButton>
                        </Box>
                        {expandedDiets.includes(diet.id) && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2">
                              <strong>Калории:</strong>{" "}
                              {Math.round(diet.calories)} ккал
                            </Typography>
                            <Typography variant="body2">
                              <strong>Белки:</strong> {Math.round(diet.protein)}{" "}
                              г
                            </Typography>
                            <Typography variant="body2">
                              <strong>Жиры:</strong> {Math.round(diet.fats)} г
                            </Typography>
                            <Typography variant="body2">
                              <strong>Углеводы:</strong>{" "}
                              {Math.round(diet.carbs)} г
                            </Typography>
                          </Box>
                        )}
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default History;
