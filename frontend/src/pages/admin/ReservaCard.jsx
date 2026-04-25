import React from 'react';

const ReservaCard = ({ reserva, onClick }) => {
  const getBadgeClass = (estado) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'admin-badge-pendiente';
      case 'CONFIRMADA':
        return 'admin-badge-confirmada';
      case 'CANCELADA':
        return 'admin-badge-cancelada';
      default:
        return '';
    }
  };

  const getTipoReserva = (reserva) => {
    // Usamos lo que manda el backend
    return (
      reserva.tipo_reserva_display ||
      reserva.tipo_reserva ||
      '—'
    );
  };

  const getEstadoTexto = (reserva) => {
    return reserva.estado_display || reserva.estado || '—';
  };

  const getFechaSolicitud = (reserva) => {
    return reserva.fecha_reserva || reserva.fecha_solicitud || '—';
  };

  return (
    <div className="admin-reserva-card" onClick={onClick}>
      <div className="admin-card-header">
        <h3 className="admin-card-title">Reserva #{reserva.id}</h3>
        <span className={`admin-badge ${getBadgeClass(reserva.estado)}`}>
          {getEstadoTexto(reserva)}
        </span>
      </div>

      <div className="admin-card-body">
        <div className="admin-card-info">
          <div className="admin-info-row">
            <span className="admin-info-label">Cliente:</span>
            <span>{reserva.cliente?.nombre || '—'}</span>
          </div>
          <div className="admin-info-row">
            <span className="admin-info-label">Tipo:</span>
            <span>{getTipoReserva(reserva)}</span>
          </div>
          <div className="admin-info-row">
            <span className="admin-info-label">Fecha solicitud:</span>
            <span>{getFechaSolicitud(reserva)}</span>
          </div>
        </div>
      </div>

      <div className="admin-card-footer">
        <button className="admin-btn admin-btn-primary">
          Ver detalle
        </button>
      </div>
    </div>
  );
};

export default ReservaCard;