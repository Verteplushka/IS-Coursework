import api from "../Axios";

export const addExercise = async (data) => {
  const res = await api.post("/admin/add_exercise", data);
  return res;
};
