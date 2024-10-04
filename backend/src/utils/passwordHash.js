import bcrypt from "bcrypt";

export const passwordHash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return (password = await bcrypt.hash(password, salt));
};
