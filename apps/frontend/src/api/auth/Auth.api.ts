import axios from "@/lib/api";
import type { RegisterInput } from "@selnic/shared";
import { isAxiosError } from "axios";

export async function createAccount(formData: RegisterInput) {
  try {
    const url = "/auth/create-account";
    const { data } = await axios.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
