import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <>
      <h1 className="font-black text-center text-4xl text-white">Error</h1>
      <p className="mt-10 text-center text-white">
        Tal vez quieras volver a{" "}
        <Link className="text-[#38bdf8] hover:underline transition-" to={"/"}>
          Inicio
        </Link>
      </p>
    </>
  );
};

export default ErrorPage;
