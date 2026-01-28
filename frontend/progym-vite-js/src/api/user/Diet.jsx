import api from "../Axios";

export const getTodayDiet = () =>
  api.get("/users/me/diet/today").then((res) => res.data);

export const regenerateTodayDiet = () => api.get("/users/me/diet/today/regenerate");
