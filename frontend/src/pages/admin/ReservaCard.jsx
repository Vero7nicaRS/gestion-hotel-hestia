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

  return (
    <div className="admin-reserva-card" onClick={onClick}>
      <div className="admin-card-header">
        <h3 className="admin-card-title">Reserva #{reserva.id}</h3>
        <span className={`admin-badge ${getBadgeClass(reserva.estado)}`}>
          {reserva.estado}
        </span>
      </div>

      <div className="admin-card-body">
        <div className="admin-card-info">
          <div className="admin-info-row">
            <span className="admin-info-label">Cliente:</span>
            <span>{reserva.cliente?.nombre || 'N/A'}</span>
          </div>
          <div className="admin-info-row">
            <span className="admin-info-label">Tipo:</span>
            <span>{reserva.tipo_reserva_display || reserva.tipo_reserva}</span>
          </div>
          <div className="admin-info-row">
            <span className="admin-info-label">Fecha solicitud:</span>
            <span>{new Date(reserva.fecha_reserva).toLocaleDateString('es-CO')}</span>
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
