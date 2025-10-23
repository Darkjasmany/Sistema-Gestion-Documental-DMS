import { loginSchema } from "./login.schema";
export const validateEmailSchema = loginSchema.pick({
    email: true,
});
