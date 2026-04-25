from django.core.mail import send_mail
from django.conf import settings
import ssl
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def enviar_email_confirmacion(reserva):
    try:
        subject = f'Confirmación de Reserva - Hotel Hestia'
        
        if reserva.tipo_reserva == 'HABITACION':
            detalle = reserva.reservahabitacion
            mensaje = f'''
Estimado/a {reserva.cliente.nombre},

Su reserva de habitacion ha sido CONFIRMADA.

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

Su reserva de sala ha sido CONFIRMADA.

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

        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE

        with smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT, timeout=30) as server:
            server.set_debuglevel(0)
            server.starttls(context=context)  
            server.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)

            msg = MIMEMultipart()
            msg['From'] = settings.DEFAULT_FROM_EMAIL
            msg['To'] = reserva.cliente.email
            msg['Subject'] = subject
            msg.attach(MIMEText(mensaje, 'plain'))
            
            server.send_message(msg)
            
        print(f"✅ Email de confirmación enviado a {reserva.cliente.email}")
        return True
        
    except Exception as e:
        print(f"❌ Error al enviar email de confirmación: {e}")
        return False


def enviar_email_cancelacion(reserva, motivo=""):
    try:
        subject = f'Cancelación de Reserva - Hotel Hestia'
        
        mensaje = f'''
Estimado/a {reserva.cliente.nombre},

Su reserva ha sido CANCELADA.

MOTIVO: {motivo if motivo else "Cancelacion, el lugar ya a sido reservado"}

Si tiene alguna duda, puede contactarnos.

Saludos cordiales,
Hotel Hestia
'''

        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE

        with smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT, timeout=30) as server:
            server.set_debuglevel(0)
            server.starttls(context=context)
            server.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
          
            msg = MIMEMultipart()
            msg['From'] = settings.DEFAULT_FROM_EMAIL
            msg['To'] = reserva.cliente.email
            msg['Subject'] = subject
            msg.attach(MIMEText(mensaje, 'plain'))
    
            server.send_message(msg)
            
        print(f"✅ Email de cancelación enviado a {reserva.cliente.email}")
        return True
        
    except Exception as e:
        print(f"❌ Error al enviar email de cancelación: {e}")
        return False
