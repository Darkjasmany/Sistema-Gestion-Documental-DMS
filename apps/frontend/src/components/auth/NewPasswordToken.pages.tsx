import type { TokenInput } from "@selnic/shared";
import type React from "react";

interface NewPasswordTokenProps {
  token: TokenInput;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setIsValidToken: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewPasswordToken = ({ token, setToken, setIsValidToken }: NewPasswordTokenProps) => {
  return <div>NewPasswordToken</div>;
};

export default NewPasswordToken;
