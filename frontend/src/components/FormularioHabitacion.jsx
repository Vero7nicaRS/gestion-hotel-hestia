import { useState, useEffect } from "react";
import "../styles/FormularioHabitacion.css";

export default function FormularioHabitacion({ tipoHabitacion }) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono:"",
    habitacion: "",
    numero_personas: 1,
    fecha_entrada: "",
    fecha_salida: "",
  });

  const [habitaciones, setHabitaciones] = useState([]);
  const [precioTotal, setPrecioTotal] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [noches, setNoches] = useState(0);

  //filtro para saber cual información mostrar segun el tipo de habitación
  const habitacionesFiltradas = tipoHabitacion
  ? habitaciones.filter(
      (h) =>
        h.estado === "DISPONIBLE" &&
        h.tipo_habitacion.nombre.toUpperCase() ===
          tipoHabitacion.toUpperCase()
    )
  : habitaciones.filter((h) => h.estado === "DISPONIBLE");

  //Traer habitaciones
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/habitaciones/")
      .then((res) => res.json())
      .then((data) => setHabitaciones(data))
      .catch((err) => console.error(err));
  }, []);

  //Calcular precio
  useEffect(() => {
    const { fecha_entrada, fecha_salida, habitacion } = formData;
    if (habitacion && fecha_entrada && fecha_salida) {
      const entrada = new Date(fecha_entrada);
      const salida = new Date(fecha_salida);
      const diferencia = (salida - entrada) / (1000 * 60 * 60 * 24);
      if (diferencia >= 1) {
        setNoches(diferencia);
        const habit = habitaciones.find(
          (h) => h.id === parseInt(habitacion)
        );
        const precio = habit
          ? Number(habit.tipo_habitacion.precio)
          : 0;
        setPrecioTotal(precio * diferencia);
      } else {
        setNoches(0);
        setPrecioTotal(0);
      }
    } else {
      setNoches(0);
      setPrecioTotal(0);
    }
  }, [formData, habitaciones]);
   
  //Actualizar inputs usados por el cliente
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //ENVIAR RESERVA
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/reserva-habitacion/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cliente: {
              nombre: formData.nombre,
              email: formData.email,
              telefono: formData.telefono,
            },
            habitacion: parseInt(formData.habitacion),
            numero_personas: parseInt(formData.numero_personas),
            fecha_entrada: formData.fecha_entrada,
            fecha_salida: formData.fecha_salida,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error de Django:", errorData);
        setMensaje("❌ " + JSON.stringify(errorData));
        setCargando(false);
        return;
      }
      const data = await response.json();
      setMensaje("✅ Reserva creada correctamente");

      // limpiar formulario
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        habitacion: "",
        numero_personas: 1,
        fecha_entrada: "",
        fecha_salida: "",
      });

      setPrecioTotal(0);
      setNoches(0);
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al crear la reserva");
    } finally {
      setCargando(false);
    }
  };

  //Fechas válidas
  //Hoy
  const hoy = new Date();
  hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
  const hoyString = hoy.toISOString().split("T")[0];
  //Maximo 3 meses
  const fechaMax = new Date();
  fechaMax.setMonth(fechaMax.getMonth() + 3);
  fechaMax.setMinutes(fechaMax.getMinutes() - fechaMax.getTimezoneOffset());
  const fechaMaxString = fechaMax.toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="card-formulario">
      <h1 className="titulo"><strong>Reservar</strong> Habitación</h1>

      <h2 className="subtitulos">Datos personales</h2>
      <div className="grid-personales">

        <div className="grupo-formulario nombre">
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required placeholder=""/>
          <label>Nombre completo</label>
        </div> 

        <div className="grupo-formulario">
          <input type="email"name="email"value={formData.email}onChange={handleChange}requiredplaceholder=""/>
          <label>Correo electrónico</label>
        </div>
        
        <div className="grupo-formulario">
          <input type="tel"name="telefono"value={formData.telefono}onChange={handleChange}pattern="[0-9]{10}"maxLength="10"requiredplaceholder=""/>
          <label>Teléfono</label>
        </div>
      </div>

      <h2 className="subtitulos">Habitación</h2>
      <div className="grid-habitacion">

        <div className="grupo-formulario">
          <select  name="habitacion"value={formData.habitacion}onChange={handleChange}required>
            <option value="" disabled hidden></option>
            {habitacionesFiltradas.map((h) => (
              <option key={h.id} value={h.id}>
                Habitación {h.numero}
              </option>
            ))}
          </select>
          <label>Habitación</label>
        </div>

        <div className="grupo-formulario">
          <input type="number"min="1"max="8"name="numero_personas"value={formData.numero_personas}onChange={handleChange}required/>
          <label>Número de personas</label>
        </div>

        <div className="grupo-formulario">
          <input
            type={formData.fecha_entrada ? "date" : "text"}
            name="fecha_entrada"
            value={formData.fecha_entrada}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
              if (!e.target.value) e.target.type = "text";
            }}
            min={hoyString}
            max={fechaMaxString}
            onChange={handleChange}
            placeholder=" "
            required
          />
          <label>Fecha de entrada</label>
        </div>

        <div className="grupo-formulario">
          <input
            type={formData.fecha_salida ? "date" : "text"}
            name="fecha_salida"
            value={formData.fecha_salida}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
              if (!e.target.value) e.target.type = "text";
            }}
            min={formData.fecha_entrada || hoyString}
            max={fechaMaxString}
            onChange={handleChange}
            placeholder=" "
            required
          />
          <label>Fecha de salida</label>
        </div>
      </div>
      
      <div className="noches">
          {noches > 0 && (
            <p className="noches-reservadas">
              🛏️ {noches} {noches === 1 ? "noche" : "noches"} seleccionada(s)
            </p>
          )}  
        </div>
      <div className="grid-total">
        
        <div className="total">
          Total: <strong>${precioTotal.toLocaleString("es-CO")}</strong>
        </div>     
        <button type="submit"disabled={cargando}className="boton-reservar">
          {cargando ? "Enviando..." : "Reservar"}
        </button>
      </div>

      {mensaje && (
        <p style={{marginTop: "15px",color: mensaje.includes("❌") ? "red" : "green",whiteSpace: "pre-line",}}>
          {mensaje}
        </p>
      )}

    </form>
  );
}