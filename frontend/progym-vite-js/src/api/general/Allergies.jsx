import api from "../Axios";

export const getAllAllergies = async () => {
  try {
    const res = await api.get("/general/get_all_allergies");
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const addAllergy = async (allergyData) => {
  try {
    const res = await api.post("/general/add_allergy", allergyData);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};
