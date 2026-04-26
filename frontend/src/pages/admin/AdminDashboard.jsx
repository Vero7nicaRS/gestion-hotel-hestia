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

      console.log('=== DEPURACIÓN ===');
      console.log('1. Response completo:', response);
      console.log('2. Tipo de response:', typeof response);
      console.log('3. ¿Es array?:', Array.isArray(response));
      console.log('4. response.reservas:', response.reservas);
      console.log('5. response.results:', response.results);
      console.log('6. Keys de response:', Object.keys(response));
      console.log('==================');

      if (Array.isArray(response)) {
        setReservas(response);
      } else if (response.reservas) {
        setReservas(response.reservas);
      } else if (response.results) {
        setReservas(response.results);
      } else {
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


  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await cambiarEstadoReserva(id, nuevoEstado);
      // Recargamos la lista para ver el cambio reflejado
      await cargarReservas();
      cerrarDetalle();
    } catch (error) {
      console.error('❌ Error al cambiar estado:', error);
      alert('Error al cambiar el estado de la reserva');
    }
  };

  return (
    <main className="admin-dashboard">
      <h1 className="admin-title">Panel de Administración</h1>

      <div className="admin-filters">
        <button
          className={`admin-filter-btn ${!filtroEstado ? 'active' : ''}`}
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
          No hay reservas para mostrar
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
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <ReservaDetail
              reserva={reservaSeleccionada}
              onClose={cerrarDetalle}
              onCambiarEstado={handleCambiarEstado}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminDashboard;