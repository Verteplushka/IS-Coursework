import api from "../Axios";

export const getAllMeals = async () => {
  try {
    const res = await api.get("/general/get_all_meals");
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const addMeal = async (data) => {
  try {
    const res = await api.post("/admin/add_meal", data);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};
