import axios from "@/lib/api";
import { isAxiosError } from "axios";
import type { UserRegistrationForm } from "@selnic/shared";

export async function createAccount(formData: UserRegistrationForm) {
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
