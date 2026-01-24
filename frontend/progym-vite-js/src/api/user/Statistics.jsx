import api from "../Axios";

export const getTrainingStatistics = async (data) => {
  try {
    const res = await api.get("/user/get_training_statistics", data);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const getDietStatistics = async (data) => {
  try {
    const res = await api.get("/user/get_diet_statistics", data);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const getWeightProgress = async (data) => {
  try {
    const res = await api.get("/user/get_weight_progress", data);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};
