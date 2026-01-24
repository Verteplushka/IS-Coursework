import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import Header from "../Header";
import { useNavigate } from "react-router-dom";

import {
  getUserParams,
  getCurrentDay,
  sendUserForm,
  isUserLazy,
} from "../../api/user/User";
import { regenerateTodayDiet, getTodayDiet } from "../../api/user/Diet";
import {
  regenerateTodayTraining,
  completeTodayTraining,
  uncompleteTodayTraining,
  getTodayTraining,
} from "../../api/user/Training";

import TodayTrainingSection from "./TodayTrainingSection";
import TodayDietSection from "./TodayDietSection";

const HomePage = () => {
  const [diet, setDiet] = useState(null);
  const [training, setTraining] = useState(null);
  const [isTrainingCompleted, setIsTrainingCompleted] = useState(false);
  const [isEndingSoon, setIsEndingSoon] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const [userParams, setUserParams] = useState(null);

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

  useEffect(() => {
    if (!token) return;

    getUserParams()
      .then((data) => {
        setUserParams(data);
        setIsEndingSoon(data.endingSoon);
        if (data.endingSoon) setOpenDialog(true);
      })
      .catch(console.error);

    const fetchStatistics = async () => {
      try {
        const lazy = await isUserLazy();
        setIsLazy(lazy);
        if (lazy) {
          const randomLink =
            motivationalVideos[
              Math.floor(Math.random() * motivationalVideos.length)
            ];
          setMotivationalLink(randomLink);
          setOpenMotivationalDialog(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
    fetchDiet();
    fetchTraining();
  }, [token]);

  const fetchDiet = () => getTodayDiet().then(setDiet).catch(console.error);

  const fetchTraining = () =>
    getTodayTraining()
      .then((data) => {
        setTraining(data);
        setIsTrainingCompleted(data.completed);
      })
      .catch(console.error);

  const regenerateDiet = () =>
    regenerateTodayDiet().then(fetchDiet).catch(console.error);

  const regenerateTraining = () =>
    regenerateTodayTraining().then(fetchTraining).catch(console.error);

  const completeTraining = () =>
    completeTodayTraining()
      .then(() => setIsTrainingCompleted(true))
      .catch(console.error);

  const uncompleteTraining = () =>
    uncompleteTodayTraining()
      .then(() => setIsTrainingCompleted(false))
      .catch(console.error);

  const handleContinue = async () => {
    try {
      const dayResponse = await getCurrentDay();
      if (userParams) {
        const updated = { ...userParams, startTraining: dayResponse.data };
        await sendUserForm(updated);
        window.location.reload();
      }
      setOpenDialog(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = () => navigate("/userform");

  return (
    <>
      <Header />

      <Container maxWidth="md" sx={{ mt: 4 }}>
        {isLazy && (
          <Box sx={{ mb: 4 }}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  🚨 Мы заметили, что ты немного обленился, так не пойдёт!
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
                />
              </CardContent>
            </Card>
          </Box>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TodayTrainingSection
              training={training}
              isTrainingCompleted={isTrainingCompleted}
              regenerateTraining={regenerateTraining}
              completeTraining={completeTraining}
              uncompleteTraining={uncompleteTraining}
              diet={diet}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TodayDietSection diet={diet} regenerateDiet={regenerateDiet} />
          </Grid>
        </Grid>

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
      </Container>
    </>
  );
};

export default HomePage;
