import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      {/* NAVBAR */}
      <NavBar />

      {/* RUTAS */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/habitacion/:id" element={<HabitacionDetalle />} />
        <Route path="/sala/:id" element={<SalaDetalle />} />
        <Route path="/salas" element={<Salas />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/sencilla" element={<Sencilla />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/habitacion-formulario" element={<FormularioHabitacion/>} />  
        <Route path="/salas-formulario" element={<FormularioSala/>} />
        <Route path="*" element={<p>404: Página no encontrada</p>} />
      </Routes>

      {/* FOOTER */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;