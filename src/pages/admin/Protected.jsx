import { Outlet, Navigate } from "react-router-dom";
import { UseAuth } from "../../auth/AuthProvider";

const Protected = () => {
  const auth = UseAuth()

  return auth.isAuthenticated ? <Outlet/>: <Navigate to="/"/>;
};

export default Protected;
