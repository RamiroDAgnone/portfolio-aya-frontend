import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UseAuth } from "../auth/AuthProvider";
import { useSite } from "./SiteProvider";

function PublicGate() {
  const { isAuthenticated, isLoading: authLoading } = UseAuth();
  const { isPublic, isLoading: siteLoading } = useSite();
  const location = useLocation();

  if (authLoading || siteLoading) {
    return null;
  }

  const PUBLIC_PATHS = [ "/admin/login" ];

  const isPublicPath = PUBLIC_PATHS.some(path =>
    location.pathname.startsWith(path)
  );

  if (!isPublic && !isAuthenticated && !isPublicPath) {
    return <Navigate to="/en-construccion" replace />;
  }

  return <Outlet />;
}

export default PublicGate;