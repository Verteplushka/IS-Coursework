import api from "../Axios";

export const getAllMeals = async () => {
  try {
    const res = await api.get("/meals");
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const addMeal = async (data) => {
  const res = await api.post("/admin/meals", data);
  return res;
};
