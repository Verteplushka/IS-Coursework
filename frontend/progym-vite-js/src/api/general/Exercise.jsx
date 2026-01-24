import api from "../Axios";

export const addExercise = async (data) => {
  try {
    const res = await api.post("/admin/add_exercise", data);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};
