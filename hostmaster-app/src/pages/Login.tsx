import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { authenticateUser, getMeUser } from "../services/authService";
import { useTranslation } from "react-i18next";

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = await authenticateUser(username, password);
    const token = data.access_token;

    const profile = await getMeUser(token);
    const role = profile.role || "user";

    login(role, data.access_token);
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-card animate-login">
        <h1 className="text-center mb-4 login-title">{t("HostMaster")}</h1>
        <img src="/hostmaster.png" alt="Logo" className="login-logo mb-3" />
        <h3 className="text-center mb-4 login-title">
          {t("login.title")}
        </h3>{" "}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label text-white">{t("login.user")}</label>
            <input
              type="text"
              className="form-control login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("login.userLabel")}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-white">
              {t("login.password")}
            </label>
            <input
              type="password"
              className="form-control login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("login.passwordLabel")}
              required
            />
          </div>
          <button type="submit" className="btn btn-mint w-100">
            {t("login.login")}
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
