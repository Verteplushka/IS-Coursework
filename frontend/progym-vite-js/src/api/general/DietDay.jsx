import api from "../Axios";

export const addDietDay = async (data) => {
  try {
    const res = await api.post("/admin/add_diet_day", data);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};
