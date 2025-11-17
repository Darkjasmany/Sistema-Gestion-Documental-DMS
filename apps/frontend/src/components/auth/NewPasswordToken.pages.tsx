import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import type { TokenInput } from "@selnic/shared";
import type React from "react";

import { Link } from "react-router-dom";

interface NewPasswordTokenProps {
  token: TokenInput;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setIsValidToken: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewPasswordToken = ({ token, setToken, setIsValidToken }: NewPasswordTokenProps) => {
  const handleChange = () => {};

  const handleComplete = () => {};

  return (
    <>
      <form className="space-y-8 p-10 rounded-lg bg-white mt-10">
        <label className="font-normal text-2xl text-center block">Código de 6 dígitos</label>
        <div className="flex justify-center gap-5">
          <PinInput value={token} onChange={handleChange} onComplete={handleComplete}>
            <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
          </PinInput>
        </div>
      </form>
      <nav className="mt-10 flex flex-col space-y-4">
        <Link to="/auth/forgot-password" className="text-center text-gray-300 font-normal">
          Solicitar un nuevo Código
        </Link>
      </nav>
    </>
  );
};

export default NewPasswordToken;
