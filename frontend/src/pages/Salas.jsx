import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../api/api'
import '../styles/Salas.css'
import FormularioSala from "../components/FormularioSala";

// Importar imágenes locales
import SalaEco1 from '../assets/salas/Sala-eco-1.jpg'
import SalaEco2 from '../assets/salas/Sala-eco-2.jpg'
import SalaEco3 from '../assets/salas/Sala-eco-3.jpg'
import SalaEco4 from '../assets/salas/Sala-eco-4.jpg'
import SalaPro1 from '../assets/salas/Sala-pro-1.jpg'
import SalaPro2 from '../assets/salas/Sala-pro-2.webp'
import SalaPro3 from '../assets/salas/Sala-pro-3.png'
import SalaPro4 from '../assets/salas/Sala-pro-4.jpg'

// Mapeo de imágenes por nombre de sala (búsqueda flexible)
const imagenesSalas = {
  'SalaEco': [SalaEco1, SalaEco2, SalaEco3, SalaEco4],
  'SalaPro': [SalaPro1, SalaPro2, SalaPro3, SalaPro4],
}

function Salas() {
  // Estado para los tipos de sala
  const [tiposSala, setTiposSala] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estado para la imagen seleccionada de cada sala (para la galería)
  const [imagenSeleccionada, setImagenSeleccionada] = useState({})

  // Estado del formulario de reserva
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fecha_uso: '',
    sala: '',
    hora_inicio: '',
    hora_fin: ''
  })

  // Cargar tipos de sala desde la API
  useEffect(() => {
    const fetchTiposSala = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/tipo-salas/`)
        if (!response.ok) throw new Error('Error al cargar las salas')
        const data = await response.json()
        console.log('Salas cargadas del API:', data)
        console.log('Nombres de salas:', data.map(s => s.nombre))
        setTiposSala(data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }
    fetchTiposSala()
  }, [])

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Enviar formulario de reserva
  const handleSubmit = async (e) => {
    e.preventDefault()
    // TODO: Implementar lógica de envío al backend
    console.log('Datos de reserva:', formData)
    alert('Reserva enviada (pendiente de implementar)')
  }

  // Cambiar imagen seleccionada en la galería
  const handleImagenClick = (tipoSalaId, imagenUrl) => {
    setImagenSeleccionada(prev => ({ ...prev, [tipoSalaId]: imagenUrl }))
  }

  // Obtener imágenes para un tipo de sala
  const getImagenes = (nombreSala) => {
    // Primero intenta coincidencia exacta
    if (imagenesSalas[nombreSala]) {
      return imagenesSalas[nombreSala]
    }
    
    // Luego busca por coincidencia parcial (sin espacios)
    const nombreSinEspacios = nombreSala.replace(/\s+/g, '')
    for (const [clave, imagenes] of Object.entries(imagenesSalas)) {
      if (clave === nombreSinEspacios) {
        return imagenes
      }
    }
    
    // Si no encuentra, busca por palabra clave (Eco, Pro)
    if (nombreSala.toLowerCase().includes('eco')) {
      return imagenesSalas['SalaEco'] || []
    }
    if (nombreSala.toLowerCase().includes('pro')) {
      return imagenesSalas['SalaPro'] || []
    }
    
    return []
  }

  if (loading) return <div className="loading">Cargando salas...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="salas-container">
      {/* Lista de tipos de sala con galería */}
      {tiposSala.map((tipoSala) => {
        const imagenes = getImagenes(tipoSala.nombre)
        const imagenPrincipal = imagenSeleccionada[tipoSala.id] || imagenes[0]
        
        return (
          <section key={tipoSala.id} className="sala-card">
            <h1 className="sala-titulo">{tipoSala.nombre}</h1>
            
            <div className="sala-galeria">
              {/* Miniaturas */}
              <div className="galeria-miniaturas">
                {imagenes.map((img, index) => (
                  <img 
                    key={index}
                    src={img} 
                    alt={`${tipoSala.nombre} miniatura ${index + 1}`}
                    className={`miniatura ${imagenPrincipal === img ? 'activa' : ''}`}
                    onClick={() => handleImagenClick(tipoSala.id, img)}
                  />
                ))}
              </div>
              
              {/* Imagen principal */}
              <div className="galeria-principal">
                <img 
                  src={imagenPrincipal} 
                  alt={tipoSala.nombre}
                  className="imagen-principal"
                />
              </div>
            </div>

            {tipoSala.descripcion && (
              <p className="sala-descripcion">{tipoSala.descripcion}</p>
            )}
            <p className="sala-precio">Precio: ${tipoSala.precio}</p>
          </section>
        )
      })}

      {/* Formulario de reserva */}
      <div className="formulario">
          <FormularioSala />
        </div>
    </div>
  )
}

export default Salas
