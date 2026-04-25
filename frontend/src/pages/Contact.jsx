import React, { useState } from "react";
import { enviarMensajeContacto } from "../api/contactApi";
import "../styles/contact.css";     
import contactoImg from "../assets/iconos/contacto.png";
import iconCorreo from "../assets/iconos/correo.png";
import iconTelefono from "../assets/iconos/telefono.png";
import iconUbicacion from "../assets/iconos/ubicacion.png";

const Contact = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setExito("");
    setError("");

    if (!nombre.trim() || !email.trim() || !mensaje.trim()) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setEnviando(true);
    try {
      await enviarMensajeContacto({ nombre, email, mensaje });
      setExito("Tu mensaje se ha enviado correctamente. Te responderemos lo antes posible.");
      setNombre("");
      setEmail("");
      setMensaje("");
    } catch (err) {
      console.error("Error al enviar mensaje de contacto:", err);
      setError("Ocurrió un error al enviar tu mensaje. Inténtalo de nuevo en unos minutos.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="contact-page">
        <div className="contact-hero">
        <img
            src={contactoImg}
            alt="Habitación lujosa del hotel"
            className="contact-hero-image"
        />
        <div className="contact-hero-overlay" />
        </div>

    <div className="contact-page-title">
    <h1>Contacto</h1>
    </div>

      <section className="contact-content">
        <div className="contact-info">
          <h2>Estamos aquí para ayudarte</h2>
          <p>
            Queremos que tu estancia sea cómoda, tranquila y memorable. 
            Si tienes alguna duda sobre nuestras habitaciones, salas, servicios o disponibilidad, estaremos encantados de atenderte.
          </p>

          <div className="contact-details">

            <div className="contact-detail-item">
        <span className="contact-detail-icon">
            <img src={iconCorreo} alt="Icono de correo" />
        </span>
        <div className="contact-detail-text">
            <span className="contact-detail-label">Correo</span>
            <span className="contact-detail-value">
            contacto@hestiahotel.com
            </span>
        </div>
        </div>

    <div className="contact-detail-item">
    <span className="contact-detail-icon">
        <img src={iconTelefono} alt="Icono de teléfono" />
    </span>
    <div className="contact-detail-text">
        <span className="contact-detail-label">Teléfono</span>
        <span className="contact-detail-value">
        +34 600 000 000
        </span>
    </div>
    </div>

    <div className="contact-detail-item">
    <span className="contact-detail-icon">
        <img src={iconUbicacion} alt="Icono de ubicación" />
    </span>
    <div className="contact-detail-text">
        <span className="contact-detail-label">Dirección</span>
        <span className="contact-detail-value">
        Avenida Central #123, Madrid
        </span>
    </div>
    </div>
          </div>

          <div className="contact-schedule">
            <p className="contact-schedule-title">
              Horario de atención: <strong>Lunes a Domingo — 8:00 a 22:00</strong>
            </p>
            <p className="contact-schedule-subtitle">
              Síguenos en redes sociales para conocer nuestras promociones y novedades.
            </p>
          </div>
        </div>

        <div className="contact-form-card">
          <h2>Escríbenos un mensaje</h2>
          <p className="contact-form-subtitle">
            Completa el formulario y tu mensaje llegará directamente al administrador.
          </p>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="contact-form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
              />
            </div>

            <div className="contact-form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
              />
            </div>

            <div className="contact-form-group">
              <label htmlFor="mensaje">Mensaje</label>
              <textarea
                id="mensaje"
                rows="5"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Cuéntanos en qué podemos ayudarte"
              />
            </div>

            {error && <div className="contact-alert contact-alert-error">{error}</div>}
            {exito && <div className="contact-alert contact-alert-success">{exito}</div>}

            <button
              type="submit"
              className="contact-submit-btn"
              disabled={enviando}
            >
              {enviando ? "Enviando..." : "Enviar mensaje"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;