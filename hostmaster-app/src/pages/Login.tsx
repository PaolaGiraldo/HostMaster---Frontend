import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error] = useState("");

  const fetchUserProfile = async (token: string) => {
    const response = await fetch("http://3.85.88.149:8000/auth/users/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok)
      throw new Error("No se pudo obtener el perfil del usuario");

    const data = await response.json();
    return data; // Aquí debería venir el rol
  };

  const handleLogin = async (username: string, password: string) => {
    const baseUrl = import.meta.env.VITE_SERVER_URL;
    const formData = new URLSearchParams();
    formData.append("grant_type", "password");
    formData.append("username", username);
    formData.append("password", password);
    formData.append("scope", "");
    formData.append("client_id", "string");
    formData.append("client_secret", "string");

    try {
      const response = await fetch(`${baseUrl}/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error("Credenciales inválidas");
      }

      const data = await response.json();
      const token = data.access_token; // Obtener el perfil del usuario

      const profile = await fetchUserProfile(token);
      const role = profile.role || "user"; // Ajusta según el campo real

      login(role, data.access_token);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin(username, password);
      }}
    >
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Usuario"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
      />
      <button type="submit">Iniciar sesión</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default LoginForm;
