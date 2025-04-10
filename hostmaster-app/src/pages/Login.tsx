import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Container, Form } from "react-bootstrap";

const Login: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState("guest");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login(selectedRole); // Simula el login guardando el rol
    navigate("/"); // Redirige a la página principal
  };

  return (
    <Container className="mt-5">
      <h2>Simulated Login</h2>
      <Form.Group>
        <Form.Label>Select a role:</Form.Label>
        <Form.Select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="guest">Guest</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </Form.Select>
      </Form.Group>
      <Button className="mt-3" onClick={handleLogin}>
        Login
      </Button>
    </Container>
  );
  localStorage.setItem("role", selectedRole); // Suponiendo que el backend devuelve el rol del usuario
};

export default Login;
