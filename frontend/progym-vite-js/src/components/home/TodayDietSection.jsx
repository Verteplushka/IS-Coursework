import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Box,
  Divider,
  Button,
} from "@mui/material";

export default function TodayDietSection({ diet, regenerateDiet }) {
  const mealGroups = diet
    ? diet.meals.reduce((acc, meal) => {
        if (!acc[meal.mealPosition]) acc[meal.mealPosition] = [];
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
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
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
          <Button onClick={regenerateDiet} variant="contained" sx={{ mt: 2 }}>
            Обновить диету
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
