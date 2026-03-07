import React, { useState, useEffect } from 'react';
import ReservaCard from "./ReservaCard";
import ReservaDetail from "./ReservaDetail";
import { getReservas, cambiarEstadoReserva } from '../../api/adminApi';
import "../../styles/admin.css";

const AdminDashboard = () => {
  const [reservas, setReservas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    cargarReservas();
  }, [filtroEstado]);

 const cargarReservas = async () => {
  setLoading(true);
  try {
    const response = await getReservas(filtroEstado);
    
    // 🔍 LOGS DE DEPURACIÓN
    console.log('=== DEPURACIÓN ===');
    console.log('1. Response completo:', response);
    console.log('2. Tipo de response:', typeof response);
    console.log('3. ¿Es array?:', Array.isArray(response));
    console.log('4. response.reservas:', response.reservas);
    console.log('5. response.results:', response.results);
    console.log('6. Keys de response:', Object.keys(response));
    console.log('==================');
    
    // Intentar diferentes formatos
    if (Array.isArray(response)) {
      // Formato: [ {...}, {...} ]
      setReservas(response);
    } else if (response.reservas) {
      // Formato: { reservas: [...] }
      setReservas(response.reservas);
    } else if (response.results) {
      // Formato: { results: [...] } (DRF paginado)
      setReservas(response.results);
    } else {
      // No hay datos
      console.error('❌ Formato no reconocido:', response);
      setReservas([]);
    }
    
  } catch (error) {
    console.error('❌ Error al cargar:', error);
    setReservas([]);
  } finally {
    setLoading(false);
  }
};

  const abrirDetalle = (reserva) => {
    setReservaSeleccionada(reserva);
    setShowModal(true);
  };

  const cerrarDetalle = () => {
    setShowModal(false);
    setReservaSeleccionada(null);
  };


  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">Panel de Administración</h1>

      {/* Filtros */}
      <div className="admin-filters">
        <button
          className={`admin-filter-btn ${filtroEstado === null ? 'active' : ''}`}
          onClick={() => setFiltroEstado(null)}
        >
          Todas
        </button>
        <button
          className={`admin-filter-btn ${filtroEstado === 'PENDIENTE' ? 'active' : ''}`}
          onClick={() => setFiltroEstado('PENDIENTE')}
        >
          Pendientes
        </button>
        <button
          className={`admin-filter-btn ${filtroEstado === 'CONFIRMADA' ? 'active' : ''}`}
          onClick={() => setFiltroEstado('CONFIRMADA')}
        >
          Confirmadas
        </button>
        <button
          className={`admin-filter-btn ${filtroEstado === 'CANCELADA' ? 'active' : ''}`}
          onClick={() => setFiltroEstado('CANCELADA')}
        >
          Canceladas
        </button>
      </div>

      {loading ? (
        <div className="admin-loading">Cargando reservas...</div>
      ) : reservas.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">📭</div>
          <p>No hay reservas para mostrar</p>
        </div>
      ) : (
        <div className="admin-reservas-grid">
          {reservas.map((reserva) => (
            <ReservaCard
              key={reserva.id}
              reserva={reserva}
              onClick={() => abrirDetalle(reserva)}
            />
          ))}
        </div>
      )}

      {showModal && reservaSeleccionada && (
        <ReservaDetail
          reserva={reservaSeleccionada}
          onClose={cerrarDetalle}
          onCambiarEstado={handleCambiarEstado}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
