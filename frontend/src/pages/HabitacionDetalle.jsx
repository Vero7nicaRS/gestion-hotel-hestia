import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/HabitacionDetalle.css";
import ReglasHotel from "../components/ReglasHotel";
import ComodidadesHotel from "../components/ComodidadesHotel";

// Imágenes de las habitaciones 
import fotoBano from "../assets/habitacion/premium-bano.png";
import fotoCocina from "../assets/habitacion/premium-cocina.png";
import fotoEstudio from "../assets/habitacion/premium-estudio.png";
import fotoHabitacion from "../assets/habitacion/premium-habitacion.png";
import FormularioHabitacion from "../components/FormularioHabitacion";

// Iconos
import iconoCama from "../assets/iconos/cama.png";
import iconoBano from "../assets/iconos/bano.png";
import iconoCocina from "../assets/iconos/cocina.png";
import iconoDesayuno from "../assets/iconos/desayuno.png";
import iconoWifi from "../assets/iconos/wifi.png";
import iconoTelevision from "../assets/iconos/television.png";
import iconoCoche from "../assets/iconos/parqueadero.png";
import iconoCajaFuerte from "../assets/iconos/caja-fuerte.png";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";


export default function HabitacionDetalle() {
  const { id } = useParams();

  // Estados de UseFEtch
  const [habitacion, setHabitacion] = useState(null); // Datos de la habitación
  const [tipo, setTipo] = useState(null); // Datos del tipo de habitación 

  const [loading, setLoading] = useState(true); // Indica si los datos están cargados o no.
  const [error, setError] = useState(null); // Indica si hay un error o no.
 

  // Estados para las fotos 
  const fotosHabitacion = [
    {id: "habitacion", src: fotoHabitacion},
    {id: "bano", src: fotoBano},
    {id: "cocina", src: fotoCocina},
    {id: "estudio", src: fotoEstudio}
//    fotoHabitacion, fotoBano, fotoCocina, fotoEstudio
  ];
  const [fotoActual, setFotoActual] = useState(fotosHabitacion[0]);
  
  /* Manejador para las fotos: al seleccionar una imagen, 
  se coloca esa imagen como fotoHabitacionSeleccionada, 
  que es la que se muestra como imagen principal (grande). */
  const handleCambiarFotoHabitacion = (foto) => {
    setFotoActual(foto);
  }

  const handleCambiarFotoHabitacionSiguiente = () => {
    //setFotoIndice((indice_foto) => (indice_foto + 1) % fotosHabitacion.length);
    const indiceActual = fotosHabitacion.findIndex(
      (foto) => foto.id === fotoActual.id
    );

    const anteriorIndice =
      (indiceActual + 1) % fotosHabitacion.length;

    setFotoActual(fotosHabitacion[anteriorIndice]);
    }

  const handleCambiarFotoHabitacionAnterior = () => {
    //setFotoIndice((indice_foto) => (indice_foto - 1 + fotosHabitacion.length) % fotosHabitacion.length);
    const indiceActual = fotosHabitacion.findIndex(
      (foto) => foto.id === fotoActual.id
    );

    const anteriorIndice =
      (indiceActual - 1 + fotosHabitacion.length) % fotosHabitacion.length;

    setFotoActual(fotosHabitacion[anteriorIndice]);
  }

  /* Desde la API el campo "precio" puede venir en decimal.
     Ej: 50.00€ o 46,34€.
     Se desea mostrar números enteros en caso de que no tenga ningún decimal.
     Por tanto, se convierte a "Float" y se pasa a formato "String" para que respete el formato
     de la monera europea */
  const ponerFormatoPrecio = (precio) => {
    return parseFloat(precio).toLocaleString("es-ES");
  }


  useEffect(() => {
    console.log( "Lanzando fetch a la API...");
    setLoading(true);
    setError(null);

    // Obtener los datos de la API: habitación y su tipo de habitación.
    const fetchHabitacion = async () => {
      try {
        // Se obtiene el tipo de habitación.
        const responseHabitacion = await fetch(`${API_BASE}/api/tipos-habitacion/${id}/`);
        if (!responseHabitacion.ok){
          throw new Error(`ERROR HTTP: No se pudo cargar la habitación ${responseHabitacion.status}`);
        }
        const resultHabitacion = await responseHabitacion.json();
        console.log('Habitaciones cargadas del API:', resultHabitacion);

        setHabitacion(resultHabitacion);
        setTipo(resultHabitacion);
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

      } finally {
        console.log("Fetch finalizado.");
        setLoading(false); // Se pone a false "loading", ya que se han cargado los datos.
      }
    }
    fetchHabitacion();
  }, [id]);

  /* Renderizados condicionales:
      - Loading.
      - Error.
    Muestra un mensaje si está cargando la aplicación o si hay un error.
    En caso contrario, aparecerá el contenido de la aplicación 
  */
  if (loading) return <p className="hd-info">🔄 Cargando...</p>;
  if (error) return <p className="hd-error">{error}</p>;

  return (
    <div className="hd-contenedor">
      <h2 className="hd-titulo">{`Habitación ${tipo?.nombre || "Habitación"}`} </h2> 


      {/* Miniaturas a la izquierda e imagen principal a la derecha en grande */}
      <div className="hd-contenedor-fotos">
        <div className="hd-contenedor-miniaturas">
          {fotosHabitacion.map((foto) => (
            <div
              key={foto.id}
              className={`hd-miniatura ${fotoActual.id === foto.id ? "activa" : ""}`}
              onClick={() => handleCambiarFotoHabitacion(foto)}
            >
              <img src={foto.src} alt="Imagen miniatura" />
            </div>
          ))}
        </div>
        
        <div className="hd-foto-principal">
          <img src={fotoActual.src} alt="Imagen principal"  />
        </div>
      </div>
      
      {/* Botones para desplazar las fotos: Anterior y Siguiente */}
      <div className="hd-contenedor-botones-fotos"> 
        <button onClick={() => handleCambiarFotoHabitacionAnterior()}> Anterior  </button>
        <button onClick={() => handleCambiarFotoHabitacionSiguiente()}> Siguiente  </button>
      </div>

      {/* Precios */}
      <div className="hd-contenedor-precios">
        <div className="hd-contenedor-precios-izq-der">
          
          <div className="hd-precios-dinero">
            {/* Si el campo "tipo" existe, muestrame el "precio" */}
            <div className="hd-precio">{tipo?.precio ? ponerFormatoPrecio(tipo.precio): "—"} €</div>
            <div className="hd-precio-noche">Por una noche</div>
          </div>
          <div className="hd-precios-iconos">
            <img className="hd-iconos" src={iconoCama} alt = "Icono rojo cama"/>
            <span className="hd-texto-icono"> Cama </span>
          </div>
          <div className="hd-precios-iconos">
            <img className="hd-iconos" src={iconoBano} alt = "Icono rojo baño"/>
            <span className="hd-texto-icono"> Baño</span>
          </div>
          <div className="hd-precios-iconos">     
            <img className="hd-iconos" src={iconoCocina} alt = "Icono rojo cocina"/>
            <span className="hd-texto-icono">Cocina</span>
          </div>
        
        </div>
      </div>
      
      {/* Detalles */}
      <div className="hd-contenedor-detalles">
        <h3 className="hd-h3">DETALLES</h3>
        <p className="hd-text">
          {tipo?.descripcion || "Sin descripción."}
        </p>
      </div>

      {/* Comodidades */}
      <ComodidadesHotel tipo="habitacion" />
      
     
     <ReglasHotel tipo="habitacion" />

    </div>
  );
}