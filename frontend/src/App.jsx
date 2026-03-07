import './App.css'


import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HabitacionDetalle from "./pages/HabitacionDetalle";
import NavBar from "./components/NavBar";
import 'bootstrap/dist/css/bootstrap.min.css'
import Footer from './components/Footer';
import Salas from './pages/Salas';
import AdminDashboard from './pages/admin/AdminDashboard';
import Home from "./pages/home";
import Sencilla from "./pages/Sencilla";

function App() {
  return (
    <BrowserRouter>
      {/* NAVBAR */}
      <NavBar> </NavBar>

      {/* RUTAS */}
      <Routes>

        <Route path="/" element={<Home />} /> 
        <Route path="/habitacion/:id" element={<HabitacionDetalle />} />
        <Route path="/salas" element={<Salas />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/sencilla" element={<Sencilla />} />
        
        <Route path='*' element={<p>404: Página no encontrada</p>} />
      </Routes>

      {/* FOOTER */}
      <Footer></Footer>
    </BrowserRouter>
  );
}

export default App;
