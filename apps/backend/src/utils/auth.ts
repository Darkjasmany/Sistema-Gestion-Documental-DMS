import bcrypt from "bcryptjs";

// Función que recibe directamente el string y devuelve una Promesa de string
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const checkPassword = async (
  enteredPassword: string,
  storedHash: string
): Promise<boolean> => {
  return await bcrypt.compare(enteredPassword, storedHash);
};
