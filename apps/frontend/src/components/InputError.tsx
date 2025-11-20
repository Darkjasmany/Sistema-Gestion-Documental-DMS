import type React from "react";
import { IoIosWarning } from "react-icons/io";

interface InputErrorProps {
  children: React.ReactNode;
}

const InputError = ({ children }: InputErrorProps) => {
  return (
    // Estilo Inline: Texto rojo pequeño, justo debajo del input
    <p className="text-red-500 text-xs mt-1 flex items-center gap-1 font-medium">
      <IoIosWarning className="text-sm" aria-hidden="true" />
      {/* El font-medium y text-sm aseguran que el ícono tenga un tamaño adecuado */}
      {children}
    </p>
  );
};

export default InputError;
