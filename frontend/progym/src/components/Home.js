import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  Box,
  Divider,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const [diet, setDiet] = useState(null);
  const [training, setTraining] = useState(null);
  const [isTrainingCompleted, setIsTrainingCompleted] = useState(false); // Состояние для отслеживания завершенности тренировки
  const [isEndingSoon, setIsEndingSoon] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const [userParams, setUserParams] = useState(null);
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/api/user/get_user_params", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Полученные данные пользователя:", data); // Лог для отладки
        setUserParams(data); // Сохраняем параметры пользователя в состояние
        setIsEndingSoon(data.endingSoon);
        if (data.endingSoon) {
          console.log("Тренировойный план все, нужно предложить новый: ",data.endingSoon); // Лог для отладки
          setOpenDialog(true);
        }
      })
      .catch(console.error);
  }, [token]);

  const handleContinue = async () => {
    try {
      const dayResponse = await axios.get("http://localhost:8080/api/general/get_day", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (userParams) {
        const updatedParams = { ...userParams, startTraining: dayResponse.data };
  
        await axios.post("http://localhost:8080/api/user/sendForm", updatedParams, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        // После успешного обновления данных пользователя запрашиваем актуальные тренировки и рацион
        await Promise.all([
          axios.get("http://localhost:8080/api/user/get_today_training", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8080/api/user/get_today_diet", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
      }
  
      setOpenDialog(false);
    } catch (error) {
      console.error("Ошибка при обновлении данных пользователя:", error);
    }
  };
  

  const handleUpdate = () => {
    navigate("/userform");
  };

  // Функция для обновления диеты
  const regenerateDiet = () => {
    fetch("http://localhost:8080/api/user/regenerate_today_diet", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => fetchDiet())
      .catch(console.error);
  };

  // Функция для обновления тренировки
  const regenerateTraining = () => {
    fetch("http://localhost:8080/api/user/regenerate_today_training", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => fetchTraining())
      .catch(console.error);
  };

  // Функция для пометки тренировки как выполненной
  const completeTraining = () => {
    fetch("http://localhost:8080/api/user/complete_training", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.text())
      .then((message) => {
        setIsTrainingCompleted(true); // Помечаем тренировку как завершенную
      })
      .catch(console.error);
  };

  // Функция для отмены статуса тренировки
  const uncompleteTraining = () => {
    fetch("http://localhost:8080/api/user/uncomplete_training", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.text())
      .then((message) => {
        setIsTrainingCompleted(false); // Сбрасываем статус тренировки
      })
      .catch(console.error);
  };

  // Запрашиваем данные о диете
  const fetchDiet = () => {
    fetch("http://localhost:8080/api/user/get_today_diet", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setDiet)
      .catch(console.error);
  };

  // Запрашиваем данные о тренировке
  const fetchTraining = () => {
    fetch("http://localhost:8080/api/user/get_today_training", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setTraining(data);
        setIsTrainingCompleted(data.completed); // Инициализируем статус тренировки
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (!token) return;

    fetchDiet();
    fetchTraining();
  }, [token]);

  // Группируем приемы пищи по категориям
  const mealGroups = diet
    ? diet.meals.reduce((acc, meal) => {
        if (!acc[meal.mealPosition]) {
          acc[meal.mealPosition] = [];
        }
        acc[meal.mealPosition].push(meal);
        return acc;
      }, {})
    : {};

  const mealTitles = {
    BREAKFAST: "Завтрак",
    LUNCH: "Обед",
    DINNER: "Ужин",
    SNACK: "Перекус",
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Grid container spacing={10}>
          {/* Всплывающее окно */}
          <Dialog open={openDialog} onClose={handleContinue}>
            <DialogTitle>Обновление данных</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Ваши тренировки скоро закончатся, а может и уже закончились. Хотите продолжить с текущими данными или обновить информацию?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleContinue} color="primary">
                Продолжить
              </Button>
              <Button onClick={handleUpdate} color="secondary">
                Обновить
              </Button>
            </DialogActions>
          </Dialog>
          {/* Блок с тренировкой */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Сегодняшняя тренировка
                </Typography>
                {training && training.exercises.length > 0 ? (
                  <List>
                    {training.exercises.map((exercise) => (
                      <ListItem
                        key={exercise.id}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "start",
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                          {exercise.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontStyle: "italic" }}
                        >
                          {exercise.description}
                        </Typography>
                        <Box sx={{ height: 10 }} />
                        <Typography variant="body2">
                          <strong>Инструкция:</strong>
                          {exercise.execution_instructions}
                        </Typography>
                        {exercise.sets && exercise.repetitions ? (
                          <Typography variant="body2" sx={{ color: "gray" }}>
                            Подходы: {exercise.sets}, Повторения:{" "}
                            {exercise.repetitions}
                          </Typography>
                        ) : (
                          <Typography variant="body2" sx={{ color: "gray" }}>
                            Количество повторений не задано, делайте по
                            ощущениям
                          </Typography>
                        )}
                        <Divider sx={{ my: 1, width: "100%" }} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography sx={{ fontStyle: "italic", color: "gray" }}>
                    Сегодня тренировки нет, можешь отдохнуть! Может, устроишь
                    себе чиловый вечер с фильмом и вкусной едой? 🍕🎬
                  </Typography>
                )}

                {/* Кнопки только если тренировка не завершена и данные о тренировке есть */}
                {training &&
                  training.exercises.length > 0 &&
                  !isTrainingCompleted && (
                    <>
                      {diet && (
                        <Typography
                          variant="body1"
                          sx={{
                            mt: 2,
                            fontStyle: "italic",
                            color: "primary.main",
                            fontSize: "0.9rem",
                          }}
                        >
                          Эта тренировка... Кто ее вообще придумал? Срочно
                          несите другую
                        </Typography>
                      )}
                      <Button
                        onClick={regenerateTraining}
                        variant="contained"
                        sx={{ mt: 2, mr: 2 }}
                      >
                        Обновить тренировку
                      </Button>
                      <Button
                        onClick={completeTraining}
                        variant="contained"
                        color="success"
                        sx={{ mt: 2 }}
                      >
                        Я выполнил тренировку!
                      </Button>
                    </>
                  )}

                {/* Кнопки только если тренировка завершена */}
                {isTrainingCompleted && (
                  <>
                    <Typography
                      variant="body1"
                      sx={{ fontStyle: "italic", color: "green" }}
                    >
                      Молодец! Ты выполнил тренировку! 🎉
                    </Typography>
                    <Button
                      onClick={uncompleteTraining}
                      variant="contained"
                      color="error"
                      sx={{ mt: 2 }}
                    >
                      Я не выполнил тренировку
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Блок с диетой */}
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3, p: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Сегодняшняя диета
                </Typography>
                {diet ? (
                  <>
                    <Typography variant="h6" color="primary">
                      {diet.name}
                    </Typography>
                    <Typography variant="body1">
                      Калории: {Math.round(diet.calories)} ккал
                    </Typography>
                    <Typography variant="body1">
                      Белки: {Math.round(diet.protein)} г
                    </Typography>
                    <Typography variant="body1">
                      Жиры: {Math.round(diet.fats)} г
                    </Typography>
                    <Typography variant="body1">
                      Углеводы: {Math.round(diet.carbs)} г
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    {Object.keys(mealGroups).map((key) => (
                      <Box key={key} sx={{ mb: 2 }}>
                        <Typography variant="h6" sx={{ color: "#3f51b5" }}>
                          {mealTitles[key]}
                        </Typography>
                        <List>
                          {mealGroups[key].map((meal) => (
                            <ListItem
                              key={meal.id}
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "start",
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: "bold" }}
                              >
                                {meal.name}
                              </Typography>
                              <Typography variant="body2">
                                Порция: {Math.round(meal.portionSize)} г
                              </Typography>
                              <Typography variant="body2">
                                Калории: {Math.round(meal.calories)} ккал
                              </Typography>
                              <Typography variant="body2">
                                Белки: {Math.round(meal.protein)} г
                              </Typography>
                              <Typography variant="body2">
                                Жиры: {Math.round(meal.fats)} г
                              </Typography>
                              <Typography variant="body2">
                                Углеводы: {Math.round(meal.carbs)} г
                              </Typography>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    ))}
                  </>
                ) : (
                  <Typography>Загрузка данных о диете...</Typography>
                )}

                {diet && (
                  <Typography
                    variant="body1"
                    sx={{
                      mt: 2,
                      fontStyle: "italic",
                      color: "primary.main",
                      fontSize: "0.9rem",
                    }}
                  >
                    Эта диета мне совсем не подходит, давайте другую
                  </Typography>
                )}

                {/* Кнопка обновления диеты только если данные о диете есть */}
                {diet && (
                  <Button
                    onClick={regenerateDiet}
                    variant="contained"
                    sx={{ mt: 2 }}
                  >
                    Обновить диету
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default HomePage;
