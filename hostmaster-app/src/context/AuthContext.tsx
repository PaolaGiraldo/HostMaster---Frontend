import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  userRole: string | null;
  token: string | null;
  login: (role: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userRole, setUserRole] = useState<string | null>(
    localStorage.getItem("userRole")
  );
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const login = (role: string, token: string) => {
    localStorage.setItem("userRole", role);
    localStorage.setItem("token", token);
    setUserRole(role);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    setUserRole(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ userRole, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
