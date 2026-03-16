import { api } from "./api";

export const registerApi = (data:any) => {
  return api.post("api/auth/register", data);
};

export const loginApi = (data:any) => {
  return api.post("api/auth/login", data);
};
