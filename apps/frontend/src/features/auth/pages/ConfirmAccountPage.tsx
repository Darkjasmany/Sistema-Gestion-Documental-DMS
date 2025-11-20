import { confirmAccount } from "@/features/auth/api/AuthAPI";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import type { TokenInput } from "@selnic/shared";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ConfirmAccountPages = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState<TokenInput["token"]>("");

  const { mutate } = useMutation({
    mutationFn: confirmAccount,
    onError: error => {
      toast.error(error.message);
    },
    onSuccess: data => {
      toast.success(data);
      setTimeout(() => navigate("/auth/login"), 3000);
    },
  });

  const handleChange = (token: TokenInput["token"]) => {
    setToken(token);
  };

  const handleComplete = (token: TokenInput["token"]) => mutate({ token });

  return (
    <>
      {/* <h1 className="text-5xl font-black text-center">Confirma tu Cuenta</h1>{" "} */}
      <h2 className="text-2xl font-semibold text-center mb-6 text-[#38bdf8] drop-shadow-[0_0_8px_rgba(56,189,248,0.3)] select-none">
        Confirma tu Cuenta
      </h2>
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
        <Link to="/auth/forgot-password" className="text-center text-gray-300 font-normal">
          Solicitar un nuevo Código
        </Link>
      </nav>
    </>
  );
};

export default ConfirmAccountPages;
