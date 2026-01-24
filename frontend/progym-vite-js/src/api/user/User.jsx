import api from "../Axios";

export const getCurrentUser = async () => {
  try {
    const res = await api.get("/general/get_user");
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const getUserParams = async () => {
  try {
    const res = await api.get("/user/get_user_params");
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const getCurrentDay = async () => {
  try {
    const res = await api.get("/general/get_day");
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const sendUserForm = async (data) => {
  try {
    const res = await api.post("/user/sendForm", data);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const isUserLazy = async (data) => {
  try {
    const res = await api.get("/user/is_user_lazy", data);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};
