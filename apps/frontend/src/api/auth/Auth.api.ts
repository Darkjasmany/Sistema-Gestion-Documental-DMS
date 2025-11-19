import axios from "@/lib/api";
import type {
  EmailInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  TokenInput,
} from "@selnic/shared";
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

export async function confirmAccount(formData: TokenInput) {
  try {
    const url = "/auth/confirm-account";
    const { data } = await axios.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function requestConfirmationCode(formData: EmailInput) {
  try {
    const url = "/auth/request-code";
    const { data } = await axios.post<string>(url, formData);
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

export async function forgotPassword(formData: EmailInput) {
  try {
    const url = "/auth/forgot-password";
    const { data } = await axios.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function validateToken(formData: TokenInput) {
  try {
    const url = "/auth/validate-token";
    const { data } = await axios.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

interface updatePasswordWithTokenParams {
  formData: ResetPasswordInput;
  token: TokenInput["token"];
}
export async function updatePasswordWithToken({ formData, token }: updatePasswordWithTokenParams) {
  try {
    const url = `/auth/update-password/${token}`;
    const { data } = await axios.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
