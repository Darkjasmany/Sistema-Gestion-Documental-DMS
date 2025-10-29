import { validateLoginSchema } from "./login.schema";
export const validateEmailSchema = validateLoginSchema.pick({
    email: true,
});
