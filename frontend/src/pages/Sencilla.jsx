import FormularioHabitacion from "../components/FormularioHabitacion";
import FormularioSala from "../components/FormularioSala";
import "../styles/Sencilla.css";

export default function Sencilla() {
  return (
    <div className="contenedor-habitacion">

      {/* FOTO ARRIBA */}
      <div className="foto-principal">
        <img src="/Habitacion-Sencilla-2-scaled-1200x900-cropped.jpg" alt="Habitación Premium" />
      </div>

      {/* ABAJO INFO + FORMULARIO */}
      <div className="contenido-inferior">

        <div className="info">
          <h1>Habitación Premium</h1>
          <h2>200 € / noche</h2>
          <p>
            Habitación amplia con cama Queen, baño privado,
            cocina equipada y vista panorámica.
          </p>

          <h3>Comodidades</h3>
          <ul>
            <li>Wifi</li>
            <li>TV</li>
            <li>Desayuno</li>
            <li>Parqueadero</li>
          </ul>
        </div>
        <div className="formulario">
          <FormularioHabitacion tipoHabitacion="DOBLE" />
        </div>
        <div className="formulario">
          <FormularioSala />
        </div>

      </div>

    </div>
  );
}