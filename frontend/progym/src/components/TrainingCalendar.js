import React, { useEffect, useState } from "react";

import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isoWeek from "dayjs/plugin/isoWeek";

import Header from "./Header"; // Импортируем компонент Header

dayjs.extend(isoWeek);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const TrainingSchedule = () => {
  const [trainings, setTrainings] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(null);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/api/user/get_training_program", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const sortedTrainings = (data.trainings || []).sort((a, b) =>
          dayjs(a.trainingDate).diff(dayjs(b.trainingDate))
        );
        setTrainings(sortedTrainings);
        if (sortedTrainings.length > 0) {
          setCurrentWeekStart(dayjs(sortedTrainings[0].trainingDate).startOf("isoWeek"));
        }
      })
      .catch(console.error);
  }, [token]);

  const nextWeek = () => setCurrentWeekStart(currentWeekStart.add(1, "week"));
  const prevWeek = () => setCurrentWeekStart(currentWeekStart.subtract(1, "week"));

  const renderTable = () => {
    if (!currentWeekStart || trainings.length === 0) return null;

    const weekDays = Array.from({ length: 7 }, (_, i) => currentWeekStart.add(i, "day"));
    
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {weekDays.map((day) => (
                <TableCell key={day.format("YYYY-MM-DD")} align="center">
                  {day.format("DD.MM ddd")}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {weekDays.map((day) => {
                const training = trainings.find((t) => dayjs(t.trainingDate).isSame(day, "day"));
                const isFirst = training && dayjs(training.trainingDate).isSame(trainings[0].trainingDate, "day");
                const isLast = training && dayjs(training.trainingDate).isSame(trainings[trainings.length - 1].trainingDate, "day");
                return (
                  <TableCell key={day.format("YYYY-MM-DD")} align="center" sx={{
                    backgroundColor: training ? (isFirst ? "#a5d6a7" : isLast ? "#ef9a9a" : "#ffecb3") : "inherit",
                    cursor: training ? "pointer" : "default",
                  }}
                    onClick={() => training && setSelectedTraining(training)}
                  >
                    {training ? "Тренировка" : "Нет тренировки"}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <>
      <Header /> {/* Добавили Header в начало страницы */}
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Расписание тренировок
        </Typography>
        {renderTable()}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
          <Button onClick={prevWeek} disabled={!currentWeekStart || dayjs(currentWeekStart).isSameOrBefore(dayjs(trainings[0]?.trainingDate), "week")}>Предыдущая неделя</Button>
          <Button onClick={nextWeek} disabled={!currentWeekStart || dayjs(currentWeekStart).isSameOrAfter(dayjs(trainings[trainings.length - 1]?.trainingDate), "week")}>Следующая неделя</Button>
        </div>

        {/* Модальное окно с деталями тренировки */}
        <Dialog open={!!selectedTraining} onClose={() => setSelectedTraining(null)}>
          <DialogTitle>Детали тренировки</DialogTitle>
          <DialogContent>
            {selectedTraining && (
              <>
                <Typography>Дата: {dayjs(selectedTraining.trainingDate).format("DD.MM.YYYY")}</Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>Упражнения:</Typography>
                {selectedTraining.exercises.map((ex, index) => (
                  <Typography key={index}>{ex.name} ({ex.muscleGroup})</Typography>
                ))}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedTraining(null)}>Закрыть</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default TrainingSchedule;
