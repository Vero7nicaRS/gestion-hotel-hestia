from django.core.mail import send_mail
from django.conf import settings
import ssl
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def enviar_email_confirmacion(reserva):
    """
    Envía email de confirmación SIN verificación SSL (desarrollo).
    """
    try:
        # Crear mensaje
        subject = f'Confirmación de Reserva - Hotel Hestia'
        
        if reserva.tipo_reserva == 'HABITACION':
            detalle = reserva.reservahabitacion
            mensaje = f'''
Estimado/a {reserva.cliente.nombre},

Su reserva ha sido CONFIRMADA.

DETALLES DE LA RESERVA:
- Tipo: Habitación {detalle.habitacion.tipo_habitacion.nombre}
- Número: {detalle.habitacion.numero}
- Fecha entrada: {detalle.fecha_entrada}
- Fecha salida: {detalle.fecha_salida}
- Personas: {detalle.numero_personas}

Gracias por elegir Hotel Hestia.

Saludos cordiales,
Hotel Hestia
'''
        else:
            detalle = reserva.reservasala
            mensaje = f'''
Estimado/a {reserva.cliente.nombre},

Su reserva ha sido CONFIRMADA.

DETALLES DE LA RESERVA:
- Tipo: Sala {detalle.sala.tipo_sala.nombre}
- Número: {detalle.sala.numero}
- Fecha: {detalle.fecha_uso}
- Horario: {detalle.hora_inicio} - {detalle.hora_fin}
- Personas: {detalle.numero_personas}

Gracias por elegir Hotel Hestia.

Saludos cordiales,
Hotel Hestia
'''

        # Crear contexto SSL sin verificación
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE

        # Conectar a SMTP manualmente
        with smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT, timeout=30) as server:
            server.set_debuglevel(0)
            server.starttls(context=context)  # TLS sin verificar certificado
            server.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
            
            # Crear mensaje MIME
            msg = MIMEMultipart()
            msg['From'] = settings.DEFAULT_FROM_EMAIL
            msg['To'] = reserva.cliente.email
            msg['Subject'] = subject
            msg.attach(MIMEText(mensaje, 'plain'))
            
            # Enviar
            server.send_message(msg)
            
        print(f"✅ Email de confirmación enviado a {reserva.cliente.email}")
        return True
        
    except Exception as e:
        print(f"❌ Error al enviar email de confirmación: {e}")
        return False


def enviar_email_cancelacion(reserva, motivo=""):
    """
    Envía email de cancelación SIN verificación SSL (desarrollo).
    """
    try:
        subject = f'Cancelación de Reserva - Hotel Hestia'
        
        mensaje = f'''
Estimado/a {reserva.cliente.nombre},

Su reserva ha sido CANCELADA.

MOTIVO: {motivo if motivo else "Cancelación solicitada"}

Si tiene alguna duda, puede contactarnos.

Saludos cordiales,
Hotel Hestia
'''

        # Crear contexto SSL sin verificación
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE

        # Conectar a SMTP manualmente
        with smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT, timeout=30) as server:
            server.set_debuglevel(0)
            server.starttls(context=context)
            server.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
            
            # Crear mensaje MIME
            msg = MIMEMultipart()
            msg['From'] = settings.DEFAULT_FROM_EMAIL
            msg['To'] = reserva.cliente.email
            msg['Subject'] = subject
            msg.attach(MIMEText(mensaje, 'plain'))
            
            # Enviar
            server.send_message(msg)
            
        print(f"✅ Email de cancelación enviado a {reserva.cliente.email}")
        return True
        
    except Exception as e:
        print(f"❌ Error al enviar email de cancelación: {e}")
        return False
