// hooks/useAdmin.hooks.js
import { useContext } from "react";
import AdminContext from "../context/AdminProvider.context";

const useAdmin = () => {
  const context = useContext(AdminContext);
  // console.log("useAdmin context:", context); // Agrega este console.log
  return context;
};

export default useAdmin;
