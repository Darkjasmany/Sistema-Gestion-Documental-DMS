import NewPasswordToken from "@/components/auth/NewPasswordToken.pages";
import type { TokenInput } from "@selnic/shared";
import { useState } from "react";

const NewPasswordPages = () => {
  const [token, setToken] = useState<TokenInput>("");
  const [isValidToken, setIsValidToken] = useState(false);

  return (
    <>
      <h1 className="text-5xl font-black">Reestablecer Password</h1>
      <p>Ingresa el código que recibiste</p>

      {!isValidToken ? (
        <NewPasswordToken token={token} setToken={setToken} setIsValidToken={setIsValidToken} />
      ) : (
        <div>Aquí va el formulario para cambiar el password</div>
      )}
    </>
  );
};

export default NewPasswordPages;
