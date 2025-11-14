import axios from "@/lib/api";
import type { LoginInput, RegisterInput } from "@selnic/shared";
import { isAxiosError } from "axios";

export async function createAccount(formData: RegisterInput) {
  try {
    const url = "/auth/create-account";
    const { data } = await axios.post<string>(url, formData);
    console.log(data);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

interface AuthenticateParams {
  formData: LoginInput;
  rememberMe: boolean;
}

export async function authenticateUser({ formData, rememberMe }: AuthenticateParams) {
  try {
    const url = "/auth/login";
    const { data } = await axios.post<string>(url, formData);
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("AUTH_TOKEN", data);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
