import api from "../Axios";

export const getTrainingStatistics = async (data) => {
  try {
    const res = await api.get("/users/me/trainings/statistics", data);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const getDietStatistics = async (data) => {
  try {
    const res = await api.get("/users/me/diet/statistics", data);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const getWeightProgress = async (data) => {
  try {
    const res = await api.get("/users/me/weight-progress", data);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};
