import React, { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent, List, ListItem, Divider, Box } from "@mui/material";
import { LocalizationProvider, PickersDay, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Header from "./Header";

const TrainingCalendar = () => {
  const [trainings, setTrainings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/api/user/get_training_program", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.trainings)) {
          setTrainings(data.trainings);
        }
      })
      .catch(console.error);
  }, [token]);

  const selectedTraining = trainings.find((t) => 
    dayjs(t.trainingDate, "YYYY-MM-DD").isSame(selectedDate, "day")
  );

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Календарь тренировок
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticDatePicker
            displayStaticWrapperAs="desktop"
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
            renderDay={(day, _selectedDays, pickersDayProps) => {
              const isTrainingDay = trainings.some((t) =>
                dayjs(t.trainingDate, "YYYY-MM-DD").isSame(day, "day")
              );
              const isSelected = day.isSame(selectedDate, "day");

              return (
                <PickersDay
                  {...pickersDayProps}
                  sx={{
                    backgroundColor: isSelected
                      ? "#1976d2"
                      : isTrainingDay
                      ? "#ffecb3"
                      : "inherit",
                    borderRadius: "50%",
                    position: "relative",
                  }}
                >
                  {isTrainingDay && !isSelected && (
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "#ff9800",
                        position: "absolute",
                        bottom: 4,
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    />
                  )}
                </PickersDay>
              );
            }}
          />
        </LocalizationProvider>

        <Card sx={{ mt: 2, p: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Детали тренировки на {selectedDate.format("DD.MM.YYYY")}
            </Typography>
            {selectedTraining ? (
              <List>
                {selectedTraining.exercises.map((exercise, index) => (
                  <ListItem key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>{exercise.name}</Typography>
                    <Typography variant="body2">Группа мышц: {exercise.muscleGroup}</Typography>
                    <Typography variant="body2">Описание: {exercise.description}</Typography>
                    <Typography variant="body2">
                      Подходы: {exercise.sets || "не указано"}, Повторения: {exercise.repetitions || "не указано"}
                    </Typography>
                    <Divider sx={{ my: 1, width: "100%" }} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography sx={{ fontStyle: "italic", color: "gray" }}>Нет тренировки в этот день</Typography>
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default TrainingCalendar;
