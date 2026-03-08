import { api } from "./api";

export const registerApi = (data:any) => {
  return api.post("/auth/register", data);
};

export const loginApi = (data:any) => {
  return api.post("/auth/login", data);
};
