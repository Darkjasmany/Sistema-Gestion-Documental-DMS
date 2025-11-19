import NewPasswordForm from "@/components/auth/NewPasswordForm.components";
import NewPasswordToken from "@/components/auth/NewPasswordToken.components";
import type { TokenInput } from "@selnic/shared";
import { useState } from "react";

const NewPasswordPages = () => {
  const [token, setToken] = useState<TokenInput["token"]>("");
  const [isValidToken, setIsValidToken] = useState(false);

  return (
    <>
      <h1 className="text-5xl font-black">Reestablecer Password</h1>
      <p>Ingresa el código que recibiste</p>

      {!isValidToken ? (
        <NewPasswordToken token={token} setToken={setToken} setIsValidToken={setIsValidToken} />
      ) : (
        <NewPasswordForm token={token} />
      )}
    </>
  );
};

export default NewPasswordPages;
