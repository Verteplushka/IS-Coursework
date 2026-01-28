import api from "../Axios";

export const getCurrentUser = async () => {
  try {
    const res = await api.get("/users");
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const getUserParams = async () => {
  try {
    const res = await api.get("/users/me/params");
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const getCurrentDay = async () => {
  try {
    const res = await api.get("/day");
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const sendUserForm = async (data) => {
  try {
    const res = await api.post("/users/me/form", data);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const isUserLazy = async (data) => {
  try {
    const res = await api.get("/users/me/status/lazy", data);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};
