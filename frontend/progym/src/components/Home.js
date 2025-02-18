import React, { useEffect, useState } from "react"; 
import { Container, Typography, Card, CardContent, List, ListItem, ListItemText, Box, Divider, Grid } from "@mui/material";
import Header from "./Header";

const HomePage = () => {
  const [diet, setDiet] = useState(null);
  const [training, setTraining] = useState(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) return;
    
    fetch("api/user/get_today_diet", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setDiet)
      .catch(console.error);

    fetch("api/user/get_today_training", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setTraining)
      .catch(console.error);
  }, [token]);

  return (
    <>
      <Header userName="Иван" />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Блок с тренировкой */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>Сегодняшняя тренировка</Typography>
                {training && training.exercises.length > 0 ? (
                  <List>
                    {training.exercises.map((exercise, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={exercise.name} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography sx={{ fontStyle: "italic", color: "gray" }}>
                    Сегодня тренировки нет, можешь отдохнуть! Может, устроишь себе чиловый вечер с фильмом и вкусной едой? 🍕🎬
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Блок с диетой */}
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3, p: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>Сегодняшняя диета</Typography>
                {diet ? (
                  <>
                    <Typography variant="h6" color="primary">{diet.name}</Typography>
                    <Typography variant="body1">Калории: {diet.calories.toFixed(2)} ккал</Typography>
                    <Typography variant="body1">Белки: {diet.protein.toFixed(2)} г</Typography>
                    <Typography variant="body1">Жиры: {diet.fats.toFixed(2)} г</Typography>
                    <Typography variant="body1">Углеводы: {diet.carbs.toFixed(2)} г</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6">Приемы пищи:</Typography>
                    <List>
                      {diet.meals.map((meal) => (
                        <ListItem key={meal.id} sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                          <Typography variant="body1" sx={{ fontWeight: "bold" }}>{meal.name}</Typography>
                          <Typography variant="body2">Порция: {meal.portionSize.toFixed(2)} г</Typography>
                          <Typography variant="body2">Калории: {meal.calories.toFixed(2)} ккал</Typography>
                          <Typography variant="body2">Белки: {meal.protein.toFixed(2)} г</Typography>
                          <Typography variant="body2">Жиры: {meal.fats.toFixed(2)} г</Typography>
                          <Typography variant="body2">Углеводы: {meal.carbs.toFixed(2)} г</Typography>
                        </ListItem>
                      ))}
                    </List>
                  </>
                ) : (
                  <Typography>Загрузка данных о диете...</Typography>
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
