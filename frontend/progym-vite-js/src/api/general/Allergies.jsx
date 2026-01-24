import api from "../Axios";

export const getAllAllergies = async () => {
  try {
    const res = await api.get("/allergies");
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const addAllergy = async (allergyData) => {
  try {
    const res = await api.post("/admin/allergies", allergyData);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};
