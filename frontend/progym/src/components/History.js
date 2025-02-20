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
  const [expandedTrainingIndex, setExpandedTrainingIndex] = useState(null);
  const [expandedDietIndex, setExpandedDietIndex] = useState(null);
  const token = localStorage.getItem("access_token");

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

  const toggleTraining = (index) => {
    setExpandedTrainingIndex((prevIndex) =>
      prevIndex === index ? null : index
    );
  };

  const toggleDiet = (index) => {
    setExpandedDietIndex((prevIndex) => (prevIndex === index ? null : index));
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
                  <Typography>
                    Ого, похоже твоя история тренировок пустая...
                  </Typography>
                ) : (
                  <List>
                    {trainingHistory.map((training, idx) => (
                      <ListItem
                        key={idx}
                        sx={{
                          marginBottom: "10px",
                          borderRadius: "8px",
                          padding: "10px",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          width="100%"
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            sx={{ flex: 1 }}
                          >
                            {/* Индикатор выполненности */}
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: "bold",
                                marginRight: "10px",
                                color: training.completed ? "green" : "red",
                              }}
                            >
                              {training.completed ? "✔️" : "❌"}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "bold" }}
                            >
                              {`Тренировка от ${training.trainingDate}`}
                            </Typography>
                          </Box>

                          {/* Иконка для раскрытия/сворачивания */}
                          <IconButton
                            onClick={() => toggleTraining(idx)}
                            sx={{
                              color: "black",
                              marginLeft: "auto",
                            }}
                          >
                            {expandedTrainingIndex === idx ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )}
                          </IconButton>
                        </Box>
                        {expandedTrainingIndex === idx && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2">
                              <strong>Упражнения:</strong>
                            </Typography>
                            <List>
                              {training.exercises.map((exercise, index) => (
                                <ListItem
                                  key={index}
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    paddingLeft: 0, // Убираем отступы слева
                                  }}
                                >
                                  <Typography variant="body2" sx={{ flex: 1 }}>
                                    {exercise.name}
                                  </Typography>
                                  {exercise.sets && exercise.repetitions && (
                                    <Typography
                                      variant="body2"
                                      sx={{ fontSize: "0.875rem" }}
                                    >
                                      {exercise.sets} по {exercise.repetitions}
                                    </Typography>
                                  )}
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
                  <Typography>
                    Ого, похоже твоя история диет пустая...
                  </Typography>
                ) : (
                  <List>
                    {dietHistory.map((diet, idx) => (
                      <ListItem key={idx}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          width="100%"
                        >
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "bold" }}
                            >
                              {diet.name}
                            </Typography>
                            {/* Дата диеты рядом с названием */}
                            <Typography variant="body2" sx={{ color: "gray" }}>
                              {new Date(diet.dietDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <IconButton
                            onClick={() => toggleDiet(idx)}
                            sx={{ color: "black" }}
                          >
                            {expandedDietIndex === idx ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )}
                          </IconButton>
                        </Box>

                        {expandedDietIndex === idx && (
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            {/* Информация о калориях и БЖУ */}
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2">
                                  <strong>Калории:</strong>{" "}
                                  {Math.round(diet.calories)} ккал
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Белки:</strong>{" "}
                                  {Math.round(diet.protein)} г
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Жиры:</strong> {Math.round(diet.fats)}{" "}
                                  г
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Углеводы:</strong>{" "}
                                  {Math.round(diet.carbs)} г
                                </Typography>
                              </Box>

                              {/* Правая колонка с блюдами */}
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    mt: 2,
                                    fontWeight: "bold",
                                    textAlign: "center",
                                  }}
                                >
                                  <strong>Блюда:</strong>
                                </Typography>
                                <List>
                                  {diet.meals.map((meal, mealIndex) => (
                                    <ListItem
                                      key={mealIndex}
                                      sx={{ paddingLeft: 0 }}
                                    >
                                      <Typography variant="body2">
                                        {meal.name} <br /> (
                                        {Math.round(meal.calories)} ккал)
                                      </Typography>
                                    </ListItem>
                                  ))}
                                </List>
                              </Box>
                            </Box>
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
