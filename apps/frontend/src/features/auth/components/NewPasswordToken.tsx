import { validateToken } from "@/features/auth/api/AuthAPI";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import type { TokenInput } from "@selnic/shared";
import { useMutation } from "@tanstack/react-query";
import type React from "react";

import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface NewPasswordTokenProps {
  token: TokenInput["token"];
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setIsValidToken: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewPasswordToken = ({ token, setToken, setIsValidToken }: NewPasswordTokenProps) => {
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: validateToken,
    onError: error => {
      toast.error(error.message);
    },
    onSuccess: data => {
      toast.success(data);
      setIsValidToken(true);
      setTimeout(() => navigate("/auth/login"), 3000);
    },
  });

  const handleChange = (token: TokenInput["token"]) => {
    setToken(token);
  };

  const handleComplete = (token: TokenInput["token"]) => {
    mutate({ token });
  };

  return (
    <>
      <form className="space-y-8 p-10 rounded-lg bg-[0_0_8px_rgba(56,189,248,0.3)] mt-10 border border-sky-500">
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
        <Link to="/auth/request-code" className="text-center text-gray-300 font-normal">
          Solicitar un nuevo Código
        </Link>
      </nav>
    </>
  );
};

export default NewPasswordToken;
