import React from 'react';

const ReservaDetail = ({ reserva, onClose, onCambiarEstado }) => {
  if (!reserva) return null;

  const handleConfirmar = () => {
    if (window.confirm('¿Confirmar esta reserva?')) {
      onCambiarEstado(reserva.id, 'CONFIRMADA');
    }
  };

  const handleCancelar = () => {
    if (window.confirm('¿Cancelar esta reserva?')) {
      onCambiarEstado(reserva.id, 'CANCELADA');
    }
  };

  const getTipoReserva = (reserva) => {
    // Probamos varios nombres de campo posibles
    const raw =
      reserva.tiporeserva ||
      reserva.tipo_reserva ||
      reserva.tipo ||
      reserva.tiporeserva_display ||
      reserva.tipo_reserva_display;

    if (!raw) return '—';
    if (raw === 'HABITACION') return 'Habitación';
    if (raw === 'SALA') return 'Sala';
    return raw;
  };

  const getEstadoTexto = (reserva) => {
    return reserva.estado_display || reserva.estado || '—';
  };

  const getFechaSolicitud = (reserva) => {
    return reserva.fecha_reserva || reserva.fecha_solicitud || '—';
  };

  return (
    <>
      <div className="admin-modal-header">
        <h2 className="admin-modal-title">
          Detalle de Reserva #{reserva.id}
        </h2>
        <button className="admin-modal-close" onClick={onClose}>
          ✕
        </button>
      </div>
      <div className="admin-modal-body">
        <div className="admin-detail-section">
          <h3>Información del Cliente</h3>
          <div className="admin-detail-grid">
            <div className="admin-detail-item">
              <span className="admin-detail-label">Nombre</span>
              <span className="admin-detail-value">
                {reserva.cliente?.nombre || '—'}
              </span>
            </div>
            <div className="admin-detail-item">
              <span className="admin-detail-label">Email</span>
              <span className="admin-detail-value">
                {reserva.cliente?.email || '—'}
              </span>
            </div>
            <div className="admin-detail-item">
              <span className="admin-detail-label">Teléfono</span>
              <span className="admin-detail-value">
                {reserva.cliente?.telefono || '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Reserva */}
        <div className="admin-detail-section">
          <h3>Detalles de la Reserva</h3>
          <div className="admin-detail-grid">
            <div className="admin-detail-item">
              <span className="admin-detail-label">Tipo</span>
              <span className="admin-detail-value">
                {getTipoReserva(reserva)}
              </span>
            </div>
            <div className="admin-detail-item">
              <span className="admin-detail-label">Estado</span>
              <span className="admin-detail-value">
                {getEstadoTexto(reserva)}
              </span>
            </div>
            <div className="admin-detail-item">
              <span className="admin-detail-label">Fecha de solicitud</span>
              <span className="admin-detail-value">
                {getFechaSolicitud(reserva)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-modal-footer">
        {reserva.estado !== 'CONFIRMADA' && (
          <button
            className="admin-btn admin-btn-success"
            onClick={handleConfirmar}
          >
            Confirmar
          </button>
        )}
        {reserva.estado !== 'CANCELADA' && (
          <button
            className="admin-btn admin-btn-danger"
            onClick={handleCancelar}
          >
            Cancelar
          </button>
        )}
        <button
          className="admin-btn admin-btn-secondary"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </>
  );
};

export default ReservaDetail;