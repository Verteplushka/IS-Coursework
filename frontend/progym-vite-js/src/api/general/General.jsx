import api from "../Axios";

export const getDay = async () => {
  try {
    const res = await api.get("/general/get_day");
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const getDietTypes = async () => {
  try {
    const res = await api.get("/general/get_diet_types");
    return res.data;
  } catch (err) {
    console.error(err);
  }
};
