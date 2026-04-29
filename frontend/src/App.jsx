import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import HabitacionDetalle from "./pages/HabitacionDetalle";
import SalaDetalle from "./pages/SalaDetalle";
import NavBar from "./components/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./components/Footer";
import Salas from "./pages/Salas";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Home from "./pages/home";
import Sencilla from "./pages/Sencilla";
import Contact from "./pages/Contact";
import FormularioHabitacion from "./components/FormularioHabitacion";
import FormularioSala from "./components/FormularioSala";
import Disponibilidad from "./pages/Disponibilidad";
import LoginAdmin from "./pages/LoginAdmin";

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
  };

  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/habitacion/:id" element={<HabitacionDetalle />} />
        <Route path="/sala/:id" element={<SalaDetalle />} />
        <Route path="/salas" element={<Salas />} />
        <Route path="/sencilla" element={<Sencilla />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/disponibilidad" element={<Disponibilidad />} />
        <Route path="/form-habitacion" element={<FormularioHabitacion />} />
        <Route path="/form-sala" element={<FormularioSala />} />
        <Route path="/login-administracion" element={<LoginAdmin onLoginSuccess={handleAdminLogin} />}/>
        <Route path="/admin" element={isAdminAuthenticated ? (<AdminDashboard />) : (<Navigate to="/login-administracion" replace />)}/>
        <Route path="*" element={<p>404: Página no encontrada</p>} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;