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

export default function TodayTrainingSection({
  training,
  isTrainingCompleted,
  regenerateTraining,
  completeTraining,
  uncompleteTraining,
  diet,
}) {
  return (
    <Card sx={{ p: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Сегодняшняя тренировка
        </Typography>

        {training && training.exercises?.length > 0 ? (
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
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                  {exercise.description}
                </Typography>
                <Box sx={{ height: 10 }} />
                <Typography variant="body2">
                  <strong>Инструкция:</strong> {exercise.execution_instructions}
                </Typography>
                {exercise.sets && exercise.repetitions ? (
                  <Typography variant="body2" sx={{ color: "gray" }}>
                    Подходы: {exercise.sets}, Повторения: {exercise.repetitions}
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ color: "gray" }}>
                    Количество повторений не задано, делайте по ощущениям
                  </Typography>
                )}
                <Divider sx={{ my: 1, width: "100%" }} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography sx={{ fontStyle: "italic", color: "gray" }}>
            Сегодня тренировки нет, но не забывай, что правильный отдых не менее
            важен, чем тренировки. Может, устроишь себе чиловый вечер с фильмом
            и вкусной едой? 🍕🎬
          </Typography>
        )}

        {training && training.exercises?.length > 0 && !isTrainingCompleted && (
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
                Эта тренировка... Кто ее вообще придумал? Срочно несите другую
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
  );
}
