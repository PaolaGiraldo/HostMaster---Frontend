import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("grant_type", "password");
    formData.append("username", username);
    formData.append("password", password);
    formData.append("scope", "");
    formData.append("client_id", "string");
    formData.append("client_secret", "string");

    try {
      const response = await fetch("http://3.85.88.149:8000/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: formData.toString(),
      });

      if (!response.ok) throw new Error("Credenciales inválidas");

      const data = await response.json();
      const token = data.access_token;

      const profileRes = await fetch("http://3.85.88.149:8000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!profileRes.ok) throw new Error("No se pudo obtener el perfil");

      const profile = await profileRes.json();
      const role = profile.role || "user";

      login(role, token);
      navigate("/home");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Entrar
          </button>
          {error && (
            <div className="alert alert-danger mt-3 text-center">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
