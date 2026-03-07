import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {Link} from "react-router-dom";
import '../styles/NavBar.css';
import logoHestia from "../assets/logos/logo-hestia-blanco.png";
import iconoUsuario from "../assets/navbar/usuario-blanco.png";

function NavBar() {
  return (
    <Navbar expand="lg" className="navbar-contenedor" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
            <img className="navbar-logo" src={logoHestia} alt = "Logo blanco Hestia"/>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="navbar-dropdown">
            <NavDropdown title="Habitaciones" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/habitacion/1/">Sencilla</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/habitacion/1/">Doble</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/habitacion/1/">Premium</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/habitacion/1/">Familiar</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Salas" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/salas/">Eco</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/salas/">Pro</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/contacto">Contacto</Nav.Link>
            <Nav.Link className="navbar-reservas" as={Link} to="/admin" >Administracion</Nav.Link>

            <Nav.Link as={Link} to="/usuario">
              <img className="navbar-usuario" src={iconoUsuario} alt = "Logo blanco Hestia"/>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;