import api from "../Axios";

export const getTrainingHistory = () =>
  api.get("/users/me/trainings/history").then((res) => res.data);

export const getDietHistory = () =>
  api.get("/users/me/diet/history").then((res) => res.data);
