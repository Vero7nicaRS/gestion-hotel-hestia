import { useState, useEffect } from "react";
import "../styles/Formulario.css";

export default function FormularioSala() {

  const [salas, setSalas] = useState([]);

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    sala: "",
    numero_personas: 1,
    fecha_uso: "",
    jornada: "",
    hora_inicio: "",
    hora_fin: ""
  });

  const horariosManana = [8,9,10,11];
  const horariosTarde = [14,15,16,17,18];

  // Fecha mínima y máxima
  const hoy = new Date();
  const fechaMin = hoy.toISOString().split("T")[0];

  const tresMeses = new Date();
  tresMeses.setMonth(tresMeses.getMonth()+3);
  const fechaMax = tresMeses.toISOString().split("T")[0];

  const [mensaje, setMensaje] = useState("");

  // Obtener salas disponibles
  useEffect(()=>{

    fetch("http://127.0.0.1:8000/api/salas/")
      .then(res => res.json())
      .then(data => setSalas(data))
      .catch(err => console.error(err));

  },[]);

  const handleChange = (e)=>{
    const {name,value} = e.target;
    setFormData({...formData,[name]:value});
  };

  const handleSubmit = async (e)=>{

    e.preventDefault();

    if(Number(formData.hora_fin) <= Number(formData.hora_inicio)){
      setMensaje("⚠ La hora de finalización debe ser mayor que la hora de inicio");
      return;
    }

    const payload = {

      cliente:{
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono
      },

      sala: formData.sala,
      numero_personas: formData.numero_personas,
      fecha_uso: formData.fecha_uso,
      hora_inicio: `${formData.hora_inicio}:00:00`,
      hora_fin: `${formData.hora_fin}:00:00`

    };

    try{

      const response = await fetch(
        "http://127.0.0.1:8000/api/reserva-sala/",
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      if(!response.ok){
  const errorData = await response.json();
  console.log("Error backend:", errorData);
  setMensaje("❌ Error: " + JSON.stringify(errorData));
  return;
}
      const data = await response.json();
      setMensaje(
      "✅ Reserva pendiente de confirmación. Confirmación enviada al correo."
      );
    }catch(error){
      console.error(error);
      alert("Error creando reserva");
    }
  };

  const horariosDisponibles =
    formData.jornada === "manana"
      ? horariosManana
      : horariosTarde;

  return (

    <form onSubmit={handleSubmit} className="card-formulario">
      <h1 className="titulo"><strong>Reservar</strong> Sala</h1>

      <div className="grupo-formulario nombre">
        <input type="text"name="nombre"placeholder="Nombre"value={formData.nombre}onChange={handleChange}required/>
      </div>
      

      <input
        type="email"
        name="email"
        placeholder="Correo"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="telefono"
        placeholder="Teléfono"
        value={formData.telefono}
        onChange={handleChange}
        required
      />

      <select
        name="sala"
        value={formData.sala}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione sala</option>

        {salas.map((s)=>(
          <option key={s.id} value={s.id}>
            Sala {s.numero} - {s.tipo_sala.nombre}
          </option>
        ))}

      </select>

      <input
        type="number"
        name="numero_personas"
        min="1"
        value={formData.numero_personas}
        onChange={handleChange}
      />

      <input
        type="date"
        name="fecha_uso"
        value={formData.fecha_uso}
        onChange={handleChange}
        min={fechaMin}
        max={fechaMax}
        required
      />

      <select
        name="jornada"
        value={formData.jornada}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione jornada</option>
        <option value="manana">Mañana</option>
        <option value="tarde">Tarde</option>
      </select>

      <select
        name="hora_inicio"
        value={formData.hora_inicio}
        onChange={handleChange}
        required
      >

        <option value="">Hora inicio</option>

        {horariosDisponibles.map((hora)=>(
          <option key={hora} value={hora}>
            {hora}:00
          </option>
        ))}

      </select>

      <select
        name="hora_fin"
        value={formData.hora_fin}
        onChange={handleChange}
        required
      >

        <option value="">Hora fin</option>

        {horariosDisponibles.map((hora)=>(
          <option key={hora} value={hora}>
            {hora}:00
          </option>
        ))}

      </select>

      <button type="submit">
        Reservar Sala
      </button>

      {mensaje && (
        <p className="mensaje-formulario">
          {mensaje}
        </p>
      )}

    </form>

  );

}