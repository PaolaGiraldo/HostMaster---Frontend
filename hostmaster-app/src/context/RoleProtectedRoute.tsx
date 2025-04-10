import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface RoleProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole"); // Obtén el rol del usuario desde localStorage o contexto

  useEffect(() => {
    if (!userRole || !allowedRoles.includes(userRole)) {
      navigate("/"); // Redirige si no tiene permisos
    }
  }, [userRole, allowedRoles, navigate]);

  return allowedRoles.includes(userRole || "") ? children : null;
};

export default RoleProtectedRoute;
