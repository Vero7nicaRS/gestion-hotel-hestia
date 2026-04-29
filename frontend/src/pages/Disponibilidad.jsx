import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../api/api'
import '../styles/Disponibilidad.css'

import imgSencilla from '../assets/Sencilla-habitacion.jpg'
import imgDoble from '../assets/Doble-habitacion.avif'
import imgPremium from '../assets/Premium-habitacion.jpg'
import imgSalaEco from '../assets/salas/Sala-eco-1.jpg'
import imgSalaPro from '../assets/salas/Sala-pro-1.jpg'

const IMAGENES_HAB = { sencilla: imgSencilla, doble: imgDoble, premium: imgPremium }
const IMAGENES_SALA = { eco: imgSalaEco, pro: imgSalaPro }

function getImgHab(nombre = '') {
  const n = nombre.toLowerCase()
  for (const [key, img] of Object.entries(IMAGENES_HAB)) {
    if (n.includes(key)) return img
  }
  return imgSencilla
}

function getImgSala(nombre = '') {
  const n = nombre.toLowerCase()
  for (const [key, img] of Object.entries(IMAGENES_SALA)) {
    if (n.includes(key)) return img
  }
  return imgSalaEco
}

function CardHabitacion({ hab }) {
  const disponible = hab.estado === 'DISPONIBLE'
  const tipo = hab.tipo_habitacion || {}

  return (
    <div className={`disp-card ${disponible ? 'disp-card--disponible' : 'disp-card--ocupada'}`}>
      <div className="disp-card__header">
        <span className={`disp-card__tipo ${disponible ? 'disp-tipo--disponible' : 'disp-tipo--ocupada'}`}>
          {tipo.nombre || 'Habitación'}
        </span>
        <span className={`disp-card__badge ${disponible ? 'disp-badge--disponible' : 'disp-badge--ocupada'}`}>
          {disponible ? 'Disponible' : 'Ocupada'}
        </span>
      </div>

      <div className="disp-card__body">
        <img src={getImgHab(tipo.nombre)} alt={tipo.nombre} className="disp-card__img" />
        <div className="disp-card__info">
          <p className="disp-info__numero">
            <span className="disp-info__hash">#</span> Habitación {hab.numero}
          </p>
          <p className="disp-info__label">Precio Noche</p>
          <p className={`disp-info__valor ${disponible ? 'disp-valor--disponible' : 'disp-valor--ocupada'}`}>
            {tipo.precio + ' €'|| '— €'}
          </p>
          {disponible && (
            <Link to={`/habitacion/${hab.id}`} className="disp-btn-ver">
              Ver
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

function CardSala({ sala }) {
  const disponible = sala.estado === 'DISPONIBLE'
  const tipo = sala.tipo_sala || {}

  return (
    <div className={`disp-card ${disponible ? 'disp-card--disponible' : 'disp-card--ocupada'}`}>
      <div className="disp-card__header">
        <span className={`disp-card__tipo ${disponible ? 'disp-tipo--disponible' : 'disp-tipo--ocupada'}`}>
          {tipo.nombre || 'Sala'}
        </span>
        <span className={`disp-card__badge ${disponible ? 'disp-badge--disponible' : 'disp-badge--ocupada'}`}>
          {disponible ? 'Disponible' : 'Ocupada'}
        </span>
      </div>

      <div className="disp-card__body">
        <img src={getImgSala(tipo.nombre)} alt={tipo.nombre} className="disp-card__img" />
        <div className="disp-card__info">
          <p className="disp-info__numero">
            <span className="disp-info__hash">#</span> Sala {sala.numero}
          </p>
          <p className="disp-info__label">{disponible ? 'Precio' : 'Horario'}</p>
          <p className={`disp-info__valor ${disponible ? 'disp-valor--disponible' : 'disp-valor--ocupada'}`}>
            {disponible ? (tipo.precio + ' €' || '— €') : (sala.horario || '—')}
          </p>
          {disponible && (
            <Link to={`/sala/${sala.id}`} className="disp-btn-ver">
              Ver
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Disponibilidad() {
  const [habitaciones, setHabitaciones] = useState([])
  const [salas, setSalas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resHab, resSala] = await Promise.all([
          fetch(`${API_BASE_URL}/habitaciones/`),
          fetch(`${API_BASE_URL}/salas/`),
        ])

        if (!resHab.ok) throw new Error('Error al cargar habitaciones')
        if (!resSala.ok) throw new Error('Error al cargar salas')

        const [dataHab, dataSala] = await Promise.all([
          resHab.json(),
          resSala.json(),
        ])
  
        setHabitaciones(Array.isArray(dataHab) ? dataHab : dataHab.results || [])
        setSalas(Array.isArray(dataSala) ? dataSala : dataSala.results || [])
        console.log("Habi: ", dataHab);
        console.log("Sala: ", dataSala);


      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="disp-estado">Cargando disponibilidad...</div>
  if (error) return <div className="disp-estado disp-estado--error">Error: {error}</div>

  return (
    <div className="disp-container">
      <section className="disp-seccion">
        <h2 className="disp-titulo">
          <span className="disp-titulo__rojo">Reserva</span> Habitaciones
        </h2>
        <div className="disp-grid">
          {habitaciones.map(hab => (
            <CardHabitacion key={hab.id} hab={hab} />
          ))}
          {habitaciones.length === 0 && (
            <p className="disp-vacio">No hay habitaciones registradas.</p>
          )}
        </div>
      </section>

      <section className="disp-seccion">
        <h2 className="disp-titulo">
          <span className="disp-titulo__rojo">Reserva</span> Salas
        </h2>
        <div className="disp-grid">
          {salas.map(sala => (
            <CardSala key={sala.id} sala={sala} />
          ))}
          {salas.length === 0 && (
            <p className="disp-vacio">No hay salas registradas.</p>
          )}
        </div>
      </section>
    </div>
  )
}
