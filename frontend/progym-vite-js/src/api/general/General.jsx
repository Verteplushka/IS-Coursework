import api from "../Axios";

export const getDay = async () => {
  try {
    const res = await api.get("/days");
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const getDietTypes = async () => {
  try {
    const res = await api.get("/diets");
    return res.data;
  } catch (err) {
    console.error(err);
  }
};
