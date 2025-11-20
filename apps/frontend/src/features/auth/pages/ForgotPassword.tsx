import InputError from "@/components/InputError";
import { forgotPassword } from "@/features/auth/api/Auth";
import type { EmailInput } from "@selnic/shared";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPasswordPages = () => {
  const initialValues: EmailInput = { email: "" };

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<EmailInput>({
    defaultValues: initialValues,
  });

  const { mutate } = useMutation({
    mutationFn: forgotPassword,
    onError: errors => {
      toast.error(errors.message);
    },
    onSuccess: data => {
      toast.success(data);
    },
  });

  const hangleResetPassword = (formData: EmailInput) => {
    mutate(formData);
    reset();
  };

  return (
    <>
      <form action="" className="space-y-5" onSubmit={handleSubmit(hangleResetPassword)}>
        <div>
          <label htmlFor="email" className="sr-only">
            Correo electrónico
          </label>
          <div className="relative">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            >
              <MdEmail />
            </span>
            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="Correo electrónico"
              className={`pl-12 pr-4 h-12 w-full rounded-md bg-[#0f172a]/60 text-white border placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#334155] focus:ring-sky-500"
              }`}
              aria-required="true"
              aria-invalid={errors.email ? "true" : "false"}
              {...register("email", {
                required: "El Email de registro es obligatorio",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "E-mail no válido",
                },
              })}
            />
          </div>
          {errors.email && <InputError>{errors.email.message}</InputError>}
        </div>

        <div className="flex items-center justify-end text-sm text-gray-400">
          <Link to="/auth/login" className="hover:text-sky-400 transition select-none">
            ¿Ya tienes cuenta? Iniciar Sesión
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-md shadow-lg shadow-sky-500/20 transition-all"
        >
          ENVIAR INSTRUCCIONES
        </button>
      </form>
      <p className="text-center text-sm text-gray-400 mt-6 select-none">
        ¿No tienes una cuenta?{" "}
        <Link to="/auth/register" className="text-sky-400 hover:underline">
          Regístrate
        </Link>
      </p>
    </>
  );
};

export default ForgotPasswordPages;
