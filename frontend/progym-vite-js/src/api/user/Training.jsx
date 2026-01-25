import api from "../Axios";

export const getTodayTraining = () =>
  api.get("/users/me/trainings/today").then((res) => res.data);

export const regenerateTodayTraining = () =>
  api.get("/users/me/trainings/today/regenerate");

export const completeTodayTraining = () => api.post("/users/me/trainings/today/complete");

export const uncompleteTodayTraining = () =>
  api.post("/users/me/trainings/today/uncomplete");

export const getTrainingProgram = () => api.get("/users/me/training-program");
