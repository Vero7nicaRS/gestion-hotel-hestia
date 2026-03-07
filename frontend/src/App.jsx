import './App.css'


import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HabitacionDetalle from "./pages/HabitacionDetalle";
import NavBar from "./components/NavBar";
import 'bootstrap/dist/css/bootstrap.min.css'
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      {/* NAVBAR */}
      <NavBar> </NavBar>

      {/* RUTAS */}
      <Routes>

        <Route path="/" element={<Navigate to="/habitacion/1" replace />} />  
        <Route path="/habitacion/:id" element={<HabitacionDetalle />} />
        <Route path="/navbar" element={<NavBar />} />
        <Route path='*' element={<p>404: Página no encontrada</p>} />
      </Routes>

      {/* FOOTER */}
      <Footer></Footer>
    </BrowserRouter>
  );
}

export default App;