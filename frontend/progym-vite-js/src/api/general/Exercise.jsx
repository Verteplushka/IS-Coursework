import api from "../Axios";

export const addExercise = async (data) => {
  const res = await api.post("/admin/exercises", data);
  return res;
};
