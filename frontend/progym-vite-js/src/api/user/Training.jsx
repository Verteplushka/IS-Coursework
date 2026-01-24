import api from "../Axios";

export const getTodayTraining = () =>
  api.get("/user/get_today_training").then((res) => res.data);

export const regenerateTodayTraining = () =>
  api.get("/user/regenerate_today_training");

export const completeTodayTraining = () => api.post("/user/complete_training");

export const uncompleteTodayTraining = () =>
  api.post("/user/uncomplete_training");

export const getTrainingProgram = () => api.get("/user/get_training_program");
