import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login-admin.css";

const LoginAdmin = ({ onLoginSuccess }) => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Login básico: admin / 123
    if (usuario === "admin" && contrasena === "123") {
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      navigate("/admin");
    } else {
      setError("Credenciales incorrectas. Intenta de nuevo.");
    }
  };

  return (
    <div className="login-admin-page">
      <div className="login-admin-card">
        <h1 className="login-admin-title">Login administración</h1>
        <p className="login-admin-subtitle">
          Acceso reservado al personal autorizado de HESTIA.
        </p>

        <form onSubmit={handleSubmit} className="login-admin-form">
          <div className="login-admin-group">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="admin"
            />
          </div>

          <div className="login-admin-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              id="contrasena"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="••••••"
            />
          </div>

          {error && <div className="login-admin-error">{error}</div>}

          <button type="submit" className="login-admin-btn">
            Entrar al panel
          </button>
        </form>

        <p className="login-admin-hint">
          Para este entorno de pruebas: usuario <strong>admin</strong>,{" "}
          contraseña <strong>123</strong>.
        </p>
      </div>
    </div>
  );
};

export default LoginAdmin;