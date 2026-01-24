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
import {
  getUserParams,
  getCurrentDay,
  sendUserForm,
  isUserLazy,
} from "../api/user/User";
import { regenerateTodayDiet, getTodayDiet } from "../api/user/Diet";
import {
  regenerateTodayTraining,
  completeTodayTraining,
  uncompleteTodayTraining,
  getTodayTraining,
} from "../api/user/Training";

const HomePage = () => {
  const [diet, setDiet] = useState(null);
  const [training, setTraining] = useState(null);
  const [isTrainingCompleted, setIsTrainingCompleted] = useState(false);
  const [isEndingSoon, setIsEndingSoon] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const [userParams, setUserParams] = useState(null);

  useEffect(() => {
    if (!token) return;

    getUserParams()
      .then((data) => {
        console.log("Полученные данные пользователя:", data);
        setUserParams(data);
        setIsEndingSoon(data.endingSoon);
        if (data.endingSoon) {
          console.log(
            "Тренировойный план все, нужно предложить новый: ",
            data.endingSoon,
          );
          setOpenDialog(true);
        }
      })
      .catch(console.error);
  }, [token]);

  const handleContinue = async () => {
    try {
      const dayResponse = getCurrentDay();

      if (userParams) {
        const updatedParams = {
          ...userParams,
          startTraining: dayResponse.data,
        };

        sendUserForm(updatedParams);
        window.location.reload();
      }

      setOpenDialog(false);
    } catch (error) {
      console.error("Ошибка при обновлении данных пользователя:", error);
    }
  };

  const handleUpdate = () => {
    navigate("/userform");
  };

  const regenerateDiet = () => {
    regenerateTodayDiet()
      .then(() => fetchDiet())
      .catch(console.error);
  };

  const regenerateTraining = () => {
    regenerateTodayTraining.then(() => fetchTraining()).catch(console.error);
  };

  const completeTraining = () => {
    completeTodayTraining()
      .then((message) => {
        setIsTrainingCompleted(true);
      })
      .catch(console.error);
  };

  const uncompleteTraining = () => {
    uncompleteTodayTraining()
      .then((message) => {
        setIsTrainingCompleted(false);
      })
      .catch(console.error);
  };

  const fetchDiet = () => {
    getTodayDiet().then(setDiet).catch(console.error);
  };

  const fetchTraining = () => {
    getTodayTraining()
      .then((data) => {
        setTraining(data);
        setIsTrainingCompleted(data.completed);
      })
      .catch(console.error);
  };

  const [isLazy, setIsLazy] = useState(false);
  const [openMotivationalDialog, setOpenMotivationalDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [motivationalLink, setMotivationalLink] = useState("");

  const motivationalVideos = [
    "https://www.youtube.com/watch?v=8Y1HcUOr8io",
    "https://www.youtube.com/watch?v=RJQisT_dndc",
    "https://www.youtube.com/watch?v=DFJcnag8S0c",
    "https://www.youtube.com/watch?v=7cSHcUP-8Os",
  ];

  const motivationalMessages = [
    "«Чемпионами становятся не в тренажёрных залах. Чемпиона рождает то, что у человека внутри — желания, мечты, цели», — Мухаммед Али 🚀",
    "«Я никогда не понимал значение слова «сдаться»», — Жан-Клод Ван Дамм 💪",
    "«Тот, кто хочет добиться убедительных побед, обязан пытаться прыгнуть выше головы», — Лев Яшин 🌟",
    "«Тренируйся с теми, кто сильнее. Не сдавайся там, где сдаются другие. И победишь там, где победить нельзя», — Брюс Ли 🔥",
    "«Сильный характер выковывается, только когда преодолеваешь сопротивление — и в спортивном зале, и в жизни», — Арнольд Шварценеггер 💪",
  ];

  const fetchStatistics = async () => {
    if (!token) {
      console.error("Токен отсутствует");
      return;
    }

    try {
      const isLazy = await isUserLazy();
      console.log("Is user lazy?", isLazy);
      setIsLazy(isLazy);

      if (isLazy) {
        const randomLink =
          motivationalVideos[
            Math.floor(Math.random() * motivationalVideos.length)
          ];
        setMotivationalLink(randomLink);
        setOpenMotivationalDialog(true);
      }
    } catch (error) {
      console.error("Ошибка при загрузке статистики:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchStatistics();

    fetchDiet();
    fetchTraining();
  }, [token]);

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
        {isLazy && (
          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  🚨 Мы заметили, что ты немного облинился, так не пойдет!
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                  {
                    motivationalMessages[
                      Math.floor(Math.random() * motivationalMessages.length)
                    ]
                  }
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Наша команда progym2004 подобрала это мотивационное видео
                  специально для тебя!
                </Typography>
                <iframe
                  width="100%"
                  height="315"
                  src={motivationalLink.replace("watch?v=", "embed/")}
                  title="Motivational Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </CardContent>
            </Card>
          </Box>
        )}
        <Grid container spacing={10}>
          <Dialog open={openDialog} onClose={handleContinue}>
            <DialogTitle>Обновление данных</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Ваши тренировки скоро закончатся, а может и уже закончились.
                Хотите продолжить с текущими данными или обновить информацию?
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
                          <strong>Инструкция:</strong>{" "}
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
                    Сегодня тренировки нет, но не забывай, что правильный отдых
                    не менее важен, чем тренировки. Может, устроишь себе чиловый
                    вечер с фильмом и вкусной едой? 🍕🎬
                  </Typography>
                )}

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
