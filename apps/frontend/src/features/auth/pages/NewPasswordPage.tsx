import NewPasswordForm from "@/features/auth/components/NewPasswordForm";
import NewPasswordToken from "@/features/auth/components/NewPasswordToken";
import type { TokenInput } from "@selnic/shared";
import { useState } from "react";

const NewPasswordPages = () => {
  const [token, setToken] = useState<TokenInput["token"]>("");
  const [isValidToken, setIsValidToken] = useState(false);

  return (
    <>
      {!isValidToken ? (
        <NewPasswordToken token={token} setToken={setToken} setIsValidToken={setIsValidToken} />
      ) : (
        <NewPasswordForm token={token} />
      )}
    </>
  );
};

export default NewPasswordPages;
