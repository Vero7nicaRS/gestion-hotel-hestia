import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/HabitacionDetalle.css";

// Imágenes de las habitaciones 
import fotoBano from "../assets/habitacion/premium-bano.png";
import fotoCocina from "../assets/habitacion/premium-cocina.png";
import fotoEstudio from "../assets/habitacion/premium-estudio.png";
import fotoHabitacion from "../assets/habitacion/premium-habitacion.png";

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
        // 1) Se obtiene Habitación
        const responseHabitacion = await fetch(`${API_BASE}/api/habitaciones/${id}/`);
        if (!responseHabitacion.ok){
          throw new Error(`ERROR HTTP: No se pudo cargar la habitación ${responseHabitacion.status}`);
        }
        const resultHabitacion = await responseHabitacion.json();

        // 2) Se obtiene el tipo de Habitación (con el objetivo de conseguir nombre, precio y descripción)
        const resTipo = await fetch(`${API_BASE}/api/tipos-habitacion/${resultHabitacion.tipo_habitacion}/`);
        if (!resTipo.ok) {
          throw new Error(`ERROR HTTP: No se pudo cargar el tipo de habitación ${resTipo.status}`);
        }
        const tipoData = await resTipo.json();

        setHabitacion(resultHabitacion);
        setTipo(tipoData);
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
      <h2 className="hd-titulo">{`Habitación ${tipo?.nombre || "Habitación"}`} {`(Nº ${habitacion?.numero})`}</h2>

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

      <div className="hd-contenedor-comodidades">
        <h3 className="hd-h3">COMODIDADES</h3>
        <p className="hd-text"> 
          Todas nuestras habitaciones disponen de conexión Wi-Fi gratuita, parking privado, servicio de desayuno y caja fuerte.
           
          Están diseñadas para ofrecer una estancia comoda y acogedora, con todo lo necesario para que los huéspedes disfruten de su visita y
          se sientan como en casa. 
        </p>
          
        <div className="hd-contenedor-comodidades-izq-der"> 
          <div className="hd-comodidades-izq">
            <div className="hd-precios-iconos">     
              <img className="hd-iconos" src={iconoWifi} alt = "Icono rojo WiFi"/>
              <span className="hd-iconos-texto">WiFi</span>
            </div>

            <div className="hd-precios-iconos">     
              <img className="hd-iconos" src={iconoTelevision} alt = "Icono rojo televisión"/>
              <span className="hd-iconos-texto">Televisión</span>
            </div>

            <div className="hd-precios-iconos">     
              <img className="hd-iconos" src={iconoCoche} alt = "Icono rojo coche"/>
              <span className="hd-iconos-texto">Parqueadero</span>
            </div>
            
          </div>

          <div className="hd-comodidades-der">
            <div className="hd-precios-iconos">     
              <img className="hd-iconos" src={iconoDesayuno} alt = "Icono rojo desayuno"/>
              <span className="hd-iconos-texto">Desayuno</span>
            </div>

            <div className="hd-precios-iconos">     
              <img className="hd-iconos" src={iconoCajaFuerte} alt = "Icono rojo caja fuerte"/>
              <span className="hd-iconos-texto">Caja fuerte</span>
            </div>

          </div>  
        </div>
      </div>
      
      <div className="hd-contenedor-reglas">
        <h3 className="hd-h3">REGLAS</h3>
        
        <div className="hd-contenedor-reglas-izq-der"> 
          <div className="hd-reglas-check-in">
            <h4 className="hd-h4">Check-in</h4>
            <ul className="hd-reglas-check-inout-guiones"> 
              <li>
                A partir de las 14:00 horas.
              </li>
            </ul>
          </div>

          <div className="hd-reglas-check-out">
            <h4 className="hd-h4">Check-out</h4>
            <ul className="hd-reglas-check-inout-guiones">
              <li>
                Hasta las 12:00 horas.
              </li>
            </ul>
          </div>  


          <div className="hd-reglas-check-in">
            <h4 className="hd-h4">Normas del hotel</h4>

            <ul className="hd-reglas-check-inout-guiones"> 
              <li>
                Es obligatorio presentar DNI o pasaporte a la llegada al hotel.
              </li>
              <li>
                No se permiten mascotas, excepto animales de asistencia.
              </li>
              <li>
                Está prohibido fumar en zonas comunes y habitaciones del hotel.
              </li>
              <li>
                Se deben utilizar las instalaciones de manera responsable y respetuosa, evitando ruidos excesivos o comportamientos que puedan molestar a otros huéspedes.
              </li>
              <li>
                Se debe respetar el descanso de los demás huéspedes, especialmente durante la noche.
              </li>
              <li>
                Se debe ser respetuoso con el personal del hotel y otros huéspedes.
              </li>  
              <li>
                Cualquier daño material, el huesped es responsable del mismo y deberá abonar el coste de reparación o reposición.
              </li>
              <li>
                Está prohibido realizar fiestas o eventos en las habitaciones del hotel. 
              </li>                          
              
            </ul>
            <p className="hd-text"> 
              El incumplimiento de estas normas puede provocar la <b>cancelación</b> de la reserva <b>sin reembolso</b>. 
              En casos graves, en la <b>expulsión</b> del hotel sin derecho a reembolso.
            </p>
          </div>
        </div>

        
      </div>

    </div>
  );
}