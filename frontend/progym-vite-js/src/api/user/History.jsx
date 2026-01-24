import api from "../Axios";

export const getTrainingHistory = () =>
  api.get("/user/get_training_history").then((res) => res.data);

export const getDietHistory = () =>
  api.get("/user/get_diet_history").then((res) => res.data);
