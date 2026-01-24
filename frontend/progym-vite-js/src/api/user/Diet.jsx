import api from "../Axios";

export const getTodayDiet = () =>
  api.get("/user/get_today_diet").then((res) => res.data);

export const regenerateTodayDiet = () => api.get("/user/regenerate_today_diet");
