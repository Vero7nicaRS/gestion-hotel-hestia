import { useState } from "react";
import { Link } from "react-router-dom";
import logoimg from "../assets/logo-hestia-blanco.png";
import iconousuarioblanco from "../assets/iconos/usuario-blanco.png";
import "../styles/Navbar.css";

export default function Navbar(){
  const [showMenu,setShowMenu] = useState(false);
  return(
    <nav className="navbar-content">
      <Link to="/" className="logo">
        <img src={logoimg} alt="Hestia Hotel Logo" />
      </Link>
      <ul className="nav-links">
        <li onMouseEnter={()=>setShowMenu(true)}
        onMouseLeave={()=>setShowMenu(false)}>
          Habitaciones
          {showMenu && (
            <ul className="dropdown">
              
              <Link to="/sencilla" onClick={()=>console.log("click")}>
              Sencilla
              </Link> 
            </ul>
          )}
        </li>
        <li>Salas</li>
        <li>Contacto</li>
        <button className="btn-reservas">Reservas</button>
      </ul>
      <Link to="/" className="icon-user">
        <img src={iconousuarioblanco} alt="Usuario Logo" />
      </Link>
    </nav>
  );
}

