import api from "../Axios";

export const addDietDay = async (data) => {
  const res = await api.post("/admin/add_diet_day", data);
  return res;
};
