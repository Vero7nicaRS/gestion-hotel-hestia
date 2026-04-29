import { Link } from "react-router-dom";
import inicio from "../assets/1-inicio.jpg";
import sencilla from "../assets/Sencilla-habitacion.jpg";
import doble from "../assets/Doble-habitacion.avif";
import eco from "../assets/Sala-eco-1.jpg";
import pro from "../assets/Sala-pro-1.jpg";
import premium from "../assets/Premium-habitacion.jpg";
import "../styles/Home.css"

export default function Home (){
  return (
    <>
      <div className="contenedor">
        <section className="hero" style={{ backgroundImage: `url(${inicio})` }} >
          <div className="hero-text">
            <h1>Bienvenido a Hestia Hotel</h1>
            <p>
              Disfruta de una experiencia única con nuestras habitaciones
              diseñadas para tu comodidad y descanso.
            </p>
          </div>
        </section>

        <section className="card-habitaciones">
          <h2>Reserve su habitación</h2>
          <div className="cardsHabitaciones">
            <div className="cardHabitacion">
              <img src={sencilla} alt="Habitación sencilla" />
              <h3>Habitación Sencilla</h3>
              <p>Habitación comoda para una persona o una pareja</p>
              <Link to="/sencilla" className="btn-card-habitacion">
                Ver más
              </Link>
            </div>
            <div className="cardHabitacion">
              <img src={premium} alt="Habitación premium" />
              <h3>Habitación Premium</h3>
              <p>Habitación comoda para una persona o una pareja</p>
              <Link to="/sencilla" className="btn-card-habitacion">
                Ver
              </Link>
            </div>
            <div className="cardHabitacion">
              <img src={doble} alt="Habitación doble" />
              <h3>Habitación Doble</h3>
              <p>Habitación comoda para una persona o una pareja</p>
              <Link to="/sencilla" className="btn-card-habitacion">
                Ver más
              </Link>
            </div>
          </div>
        </section>

        <section className="card-salas">
          <h2>Reserve su sala de eventos</h2>
          <div className="cardsSala">
            <div className="cardSala">
              <img src={pro} alt="Sala Pro" />
              <div className="cardSalaTexto">
              <h3>Sala Pro</h3>
              <p>Sala para eventos como celebración de 15 años,
                  cocteles, fistes de grado, espacio apto para 100 personas.
              </p>
              </div>
              <Link to="/sencilla" className="btn-card-salas">
                Ver
              </Link>
            </div>
            

            <div className="cardSala">
              <div className="cardSalaTexto">
              <h3>Sala Pro</h3>
              <p>Sala para eventos como celebración de 15 años,
                  cocteles, fistes de grado, espacio apto para 100 personas.
              </p>
              </div>
              <Link to="/sencilla" className="btn-card-salas">
                Ver
              </Link>
              <img src={eco} alt="Sala Pro" />
            </div>

          </div>
        </section>

      </div>
    </>
  )
}