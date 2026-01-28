import api from "../Axios";
import axios from "axios";

export const sendLogin = async (login, password) => {
  try {
    const res = await api.post("auth/authenticate", {
      login,
      password,
    });
    console.log(res);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const sendRegister = async (login, password) => {
  try {
    const res = await api.post("/auth/register", {
      login,
      password,
    });
    console.log(res);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};
