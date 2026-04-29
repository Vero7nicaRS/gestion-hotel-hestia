import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {Link} from "react-router-dom";
import '../styles/NavBar.css';
import logoHestia from "../assets/logos/logo-hestia-blanco.png";
import iconoUsuario from "../assets/navbar/usuario-blanco.png";
import { useEffect, useState } from "react";
import { Fragment } from "react";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
function NavBar() {

  const [habitaciones, setHabitaciones] = useState(null);
  const [salas, setSalas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    useEffect(() => {
      console.log( "Lanzando fetch a la API...");
      setLoading(true);
      setError(null);
  
      // Obtener los datos de la API: habitación y su tipo de habitación.
      const fetchHabitaciones = async () => {
        try {
          // Se obtiene las habitaciones.
          const responseHabitaciones = await fetch(`${API_BASE}/api/tipos-habitacion/`);
          if (!responseHabitaciones.ok){
            throw new Error(`ERROR HTTP: No se pudieron cargar las habitaciones ${responseHabitaciones.status}`);
          }
          const resultHabitacion = await responseHabitaciones.json();
  
          setHabitaciones(resultHabitacion);
        } catch (err) {
          /* Ignorar si el error de abort (no es un error real, 
          sino que es una señal de que el componente se desmontó antes
          de recibir la respuesta ) */
          if(err.name === "AbortError") {
            console.log("Fetch abortado, el componente se desmontó antes de recibir la respuesta.");
            return;
          }
          console.error("Error al obtener los datos de la habitación:", err.message);
          setError(err.message);
        }
      }

      const fetchSalas = async () => {
        try {
          // Se obtienen las salas.
          const responseSalas = await fetch(`${API_BASE}/api/tipo-salas/`);
          if (!responseSalas.ok){
            throw new Error(`ERROR HTTP: No se pudieron cargar las salas ${responseSalas.status}`);
          }
          const resultSala = await responseSalas.json();
  
          setSalas(resultSala);
        } catch (err) {
          /* Ignorar si el error de abort (no es un error real, 
          sino que es una señal de que el componente se desmontó antes
          de recibir la respuesta ) */
          if(err.name === "AbortError") {
            console.log("Fetch abortado, el componente se desmontó antes de recibir la respuesta.");
            return;
          }
  
          console.error("Error al obtener los datos de la sala:", err.message);
          setError(err.message);
        }
      }

      const cargarDatos = async () => {
        try{ 
          // Usando "Promise.all" se ejecutan ambas a la vez, y no una trás otra si se usara "await fetchHabitaciones(); await fetchSalas();"
          await Promise.all([fetchHabitaciones(), fetchSalas()]);
        } finally {
          console.log("Fetch finalizado.");
          setLoading(false); // Se pone a false "loading", ya que se han cargado los datos.
        }
      }
      cargarDatos();
    }, []);
  
  /* Renderizados condicionales:
      - Loading.
      - Error.
    Muestra un mensaje si está cargando la aplicación o si hay un error.
    En caso contrario, aparecerá el contenido de la aplicación 
  */
  if (loading) return <p className="hd-info">🔄 Cargando...</p>;
  if (error) return <p className="hd-error">{error}</p>;

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
              {/* Recorre los tipos de habitaciones y devuelve la habitación junto a un separador.
                  Si es la última habitación, no se muestra el separador. 
              */}
              {habitaciones && habitaciones.map((habitacion, index) => (
                <Fragment key={habitacion.id}>
                  <NavDropdown.Item 
                    as={Link} 
                    to={`/habitacion/${habitacion.id}`}>
                      {habitacion.nombre}
                  </NavDropdown.Item>

                  {/* Si no es la última habitación, se muestra un separador. */}
                  {index < habitaciones.length - 1 && <NavDropdown.Divider />}
                </Fragment>
              ))}
            </NavDropdown>

            <NavDropdown title="Salas" id="basic-nav-dropdown">
              {/* Recorre los tipos de salas y devuelve la sala junto a un separador.
                  Si es la última sala, no se muestra el separador. 
              */}
              {salas && salas.map((sala, index) => (
                <Fragment key={sala.id}>
                  <NavDropdown.Item 
                    as={Link} 
                    to={`/sala/${sala.id}`}>
                      {sala.nombre}
                  </NavDropdown.Item>

                  {/* Si no es la última habitación, se muestra un separador. */}
                  {index < salas.length - 1 && <NavDropdown.Divider />}
                </Fragment>
              ))}
            </NavDropdown>
   
          {/*
           <NavDropdown title="Salas" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/salas/">Eco</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/salas/">Pro</NavDropdown.Item>
            </NavDropdown>
          
          */}  
         
            <Nav.Link as={Link} to="/contacto">Contacto</Nav.Link>
            <NavDropdown title="Reservas" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/salas-formulario">Reservas Salas</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/habitacion-formulario">Reservas Habitacion</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link className="navbar-reservas" as={Link} to="/disponibilidad" >Disponibilidad</Nav.Link>
            <Nav.Link as={Link} to="/admin">
              <img className="navbar-usuario" src={iconoUsuario} alt = "Logo blanco Hestia"/>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;