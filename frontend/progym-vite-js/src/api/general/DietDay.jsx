import api from "../Axios";

export const addDietDay = async (data) => {
  const res = await api.post("/admin/diets", data);
  return res;
};
