import React from 'react';

const ReservaDetail = ({ reserva, onClose, onCambiarEstado }) => {
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

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">Detalle de Reserva #{reserva.id}</h2>
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
                <span className="admin-detail-value">{reserva.cliente?.nombre || 'N/A'}</span>
              </div>
              <div className="admin-detail-item">
                <span className="admin-detail-label">Email</span>
                <span className="admin-detail-value">{reserva.cliente?.email || 'N/A'}</span>
              </div>
              <div className="admin-detail-item">
                <span className="admin-detail-label">Teléfono</span>
                <span className="admin-detail-value">{reserva.cliente?.telefono || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="admin-detail-section">
            <h3>Detalles de la Reserva</h3>
            <div className="admin-detail-grid">
              <div className="admin-detail-item">
                <span className="admin-detail-label">Tipo</span>
                <span className="admin-detail-value">{reserva.tipo_reserva_display || reserva.tipo_reserva}</span>
              </div>
              <div className="admin-detail-item">
                <span className="admin-detail-label">Estado</span>
                <span className="admin-detail-value">{reserva.estado}</span>
              </div>
              <div className="admin-detail-item">
                <span className="admin-detail-label">Fecha de solicitud</span>
                <span className="admin-detail-value">
                  {new Date(reserva.fecha_reserva).toLocaleString('es-CO')}
                </span>
              </div>
            </div>
          </div>

          {reserva.detalle && (
            <div className="admin-detail-section">
              <h3>Información Adicional</h3>
              <div className="admin-detail-grid">
                {reserva.detalle.tipo === 'habitacion' ? (
                  <>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Habitación</span>
                      <span className="admin-detail-value">{reserva.detalle.habitacion_numero}</span>
                    </div>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Tipo Habitación</span>
                      <span className="admin-detail-value">{reserva.detalle.tipo_habitacion}</span>
                    </div>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Check-in</span>
                      <span className="admin-detail-value">{reserva.detalle.fecha_entrada}</span>
                    </div>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Check-out</span>
                      <span className="admin-detail-value">{reserva.detalle.fecha_salida}</span>
                    </div>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Personas</span>
                      <span className="admin-detail-value">{reserva.detalle.numero_personas}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Sala</span>
                      <span className="admin-detail-value">{reserva.detalle.sala_numero}</span>
                    </div>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Tipo Sala</span>
                      <span className="admin-detail-value">{reserva.detalle.tipo_sala}</span>
                    </div>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Fecha de uso</span>
                      <span className="admin-detail-value">{reserva.detalle.fecha_uso}</span>
                    </div>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Horario</span>
                      <span className="admin-detail-value">
                        {reserva.detalle.hora_inicio} - {reserva.detalle.hora_fin}
                      </span>
                    </div>
                    <div className="admin-detail-item">
                      <span className="admin-detail-label">Personas</span>
                      <span className="admin-detail-value">{reserva.detalle.numero_personas}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="admin-modal-footer">
          {reserva.estado === 'PENDIENTE' && (
            <>
              <button className="admin-btn admin-btn-success" onClick={handleConfirmar}>
                ✓ Confirmar
              </button>
              <button className="admin-btn admin-btn-danger" onClick={handleCancelar}>
                ✕ Cancelar
              </button>
            </>
          )}
          <button className="admin-btn admin-btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservaDetail;
