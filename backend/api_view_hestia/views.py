from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .models import Habitacion, TipoHabitacion, Sala, TipoSala, Cliente, Reserva, ReservaHabitacion, ReservaSala
from .serializer import HabitacionSerializer, TipoHabitacionSerializer, ReservaSerializer,ReservaSalaSerializer, SalaSerializer, TipoSalaSerializer, ClienteSerializer, ReservaHabitacionSerializer, ReservaHabitacionSerializer
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from .utils import enviar_email_confirmacion, enviar_email_cancelacion
from rest_framework.generics import ListAPIView
from datetime import date




#----------- OBTENER DATOS DEL CLIENTE -----------
def obtener_o_crear_cliente(request):
    datos_cliente = request.data.get("cliente")
    if not datos_cliente:
        return None, Response(
            {"error": "Nombre y correo son necesarios"},
            status=400
        )
    clientes, _ = Cliente.objects.get_or_create(
    email=datos_cliente["email"],
    defaults={
        "nombre": datos_cliente["nombre"],
        "telefono": datos_cliente["telefono"]
        }
    )
    return clientes,  None
#----------- ADMIN API VIEWS -----------
@api_view(['GET'])
def listar_reservas_pendientes(request):
    """
    Llamado a todas las reservas en estado PENDIENTE, con su cliente y detalles específicos según el tipo de reserva (habitacion o sala).
    """
    reservas = Reserva.objects.filter(
        estado=Reserva.Estado.PENDIENTE
    ).select_related(
        'cliente' 
    ).order_by('-fecha_reserva') 
    lista_reservas = []
    
    for reserva in reservas:
        datos_reserva = {
            'id': reserva.id,
            'fecha_reserva': reserva.fecha_reserva,
            'tipo_reserva': reserva.tipo_reserva,
            'tipo_reserva_display': reserva.get_tipo_reserva_display(),
            'estado': reserva.estado,
            
            'cliente': {
                'nombre': reserva.cliente.nombre,
                'email': reserva.cliente.email,
                'telefono': reserva.cliente.telefono
            }
        }

        if reserva.tipo_reserva == Reserva.TipoReserva.HABITACION:
            try:
                detalle = ReservaHabitacion.objects.select_related(
                    'habitacion',
                    'habitacion__tipo_habitacion'
                ).get(reserva=reserva)
                
                datos_reserva['detalle'] = {
                    'tipo': 'habitacion',
                    'habitacion_numero': detalle.habitacion.numero,
                    'tipo_habitacion': detalle.habitacion.tipo_habitacion.nombre,
                    'numero_personas': detalle.numero_personas,
                    'fecha_entrada': detalle.fecha_entrada,
                    'fecha_salida': detalle.fecha_salida
                }
            except ReservaHabitacion.DoesNotExist:
                datos_reserva['detalle'] = None
        
        elif reserva.tipo_reserva == Reserva.TipoReserva.SALA:
            try:
                detalle = ReservaSala.objects.select_related(
                    'sala',
                    'sala__tipo_sala'
                ).get(reserva=reserva)
                
                datos_reserva['detalle'] = {
                    'tipo': 'sala',
                    'sala_numero': detalle.sala.numero,
                    'tipo_sala': detalle.sala.tipo_sala.nombre,
                    'numero_personas': detalle.numero_personas,
                    'fecha_uso': detalle.fecha_uso,
                    'hora_inicio': str(detalle.hora_inicio),
                    'hora_fin': str(detalle.hora_fin)
                }
            except ReservaSala.DoesNotExist:
                datos_reserva['detalle'] = None
        
        lista_reservas.append(datos_reserva)
    
    return Response({
        'total': len(lista_reservas),
        'reservas': lista_reservas
    })

@api_view(['PATCH'])
def cambiar_estado_reserva(request, reserva_id):
    """
    Cambia el estado de una reserva (CONFIRMADA o CANCELADA).
    Si hay conflicto al confirmar, cancela automáticamente la reserva.
    Envía notificación por email al cliente.
    """
    try:
        reserva = Reserva.objects.select_related('cliente').get(id=reserva_id)
    except Reserva.DoesNotExist:
        return Response(
            {'error': 'Reserva no encontrada'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    nuevo_estado = request.data.get('estado')
    
    if nuevo_estado not in ['CONFIRMADA', 'CANCELADA']:
        return Response(
            {'error': 'Estado inválido. Usar CONFIRMADA o CANCELADA'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # ✅ VALIDACIÓN: Si se va a CONFIRMAR, verificar disponibilidad
    if nuevo_estado == 'CONFIRMADA':
        
        # --- VALIDAR HABITACIÓN ---
        if reserva.tipo_reserva == Reserva.TipoReserva.HABITACION:
            try:
                reserva_hab = ReservaHabitacion.objects.select_related('habitacion').get(reserva=reserva)
                
                reservas_yareservada = ReservaHabitacion.objects.filter(
                    habitacion=reserva_hab.habitacion,
                    reserva__estado='CONFIRMADA'
                ).filter(
                    Q(fecha_entrada__lt=reserva_hab.fecha_salida) & 
                    Q(fecha_salida__gt=reserva_hab.fecha_entrada)
                ).exclude(
                    reserva=reserva
                )
                
                if reservas_yareservada.exists():
                    yareservada = reservas_yareservada.first()
                    
                    # ✅ CANCELAR AUTOMÁTICAMENTE
                    reserva.estado = 'CANCELADA'
                    reserva.save()
                    
                    # 📧 ENVIAR EMAIL DE CANCELACIÓN
                    motivo_conflicto = f'La habitación {reserva_hab.habitacion.numero} ya tiene una reserva confirmada del {yareservada.fecha_entrada.strftime("%d/%m/%Y")} al {yareservada.fecha_salida.strftime("%d/%m/%Y")}. Por favor, elija otras fechas.'
                    email_enviado = enviar_email_cancelacion(reserva, motivo=motivo_conflicto)
                    
                    return Response({
                        'message': 'Reserva cancelada automáticamente',
                        'motivo': motivo_conflicto,
                        'reserva_id': reserva.id,
                        'nuevo_estado': 'CANCELADA',
                        'cliente': reserva.cliente.nombre,
                        'email_enviado': email_enviado,
                        'conflicto': {
                            'reserva_existente_id': yareservada.reserva.id,
                            'cliente_existente': yareservada.reserva.cliente.nombre,
                            'fecha_entrada': str(yareservada.fecha_entrada),
                            'fecha_salida': str(yareservada.fecha_salida)
                        },
                        'accion_recomendada': 'El cliente debe crear una nueva reserva en fechas diferentes'
                    }, status=status.HTTP_200_OK)
                
                # Si no hay conflicto, marcar habitación como OCUPADA
                reserva_hab.habitacion.estado = Habitacion.Estado.OCUPADA
                reserva_hab.habitacion.save()
                
            except ReservaHabitacion.DoesNotExist:
                pass
        
        # --- VALIDAR SALA ---
        elif reserva.tipo_reserva == Reserva.TipoReserva.SALA:
            try:
                reserva_sala = ReservaSala.objects.select_related('sala').get(reserva=reserva)
                
                reservas_yareservada = ReservaSala.objects.filter(
                    sala=reserva_sala.sala,
                    reserva__estado='CONFIRMADA',
                    fecha_uso=reserva_sala.fecha_uso
                ).filter(
                    Q(hora_inicio__lt=reserva_sala.hora_fin) & 
                    Q(hora_fin__gt=reserva_sala.hora_inicio)
                ).exclude(
                    reserva=reserva
                )
                
                if reservas_yareservada.exists():
                    yareservada = reservas_yareservada.first()
                    
                    # ✅ CANCELAR AUTOMÁTICAMENTE
                    reserva.estado = 'CANCELADA'
                    reserva.save()
                    
                    # 📧 ENVIAR EMAIL DE CANCELACIÓN
                    motivo_conflicto = f'La sala {reserva_sala.sala.numero} ya tiene una reserva confirmada el {yareservada.fecha_uso.strftime("%d/%m/%Y")} de {yareservada.hora_inicio.strftime("%H:%M")} a {yareservada.hora_fin.strftime("%H:%M")}. Por favor, elija otro horario.'
                    email_enviado = enviar_email_cancelacion(reserva, motivo=motivo_conflicto)
                    
                    return Response({
                        'message': 'Reserva cancelada automáticamente',
                        'motivo': motivo_conflicto,
                        'reserva_id': reserva.id,
                        'nuevo_estado': 'CANCELADA',
                        'cliente': reserva.cliente.nombre,
                        'email_enviado': email_enviado,
                        'conflicto': {
                            'reserva_existente_id': yareservada.reserva.id,
                            'cliente_existente': yareservada.reserva.cliente.nombre,
                            'fecha_uso': str(yareservada.fecha_uso),
                            'hora_inicio': str(yareservada.hora_inicio),
                            'hora_fin': str(yareservada.hora_fin)
                        },
                        'accion_recomendada': 'El cliente debe crear una nueva reserva en horario diferente'
                    }, status=status.HTTP_200_OK)
                
                # Si no hay conflicto, marcar sala como OCUPADA
                reserva_sala.sala.estado = Sala.Estado.OCUPADA
                reserva_sala.sala.save()
                
            except ReservaSala.DoesNotExist:
                pass
    
    # ✅ Actualizar estado de la reserva
    reserva.estado = nuevo_estado
    reserva.save()
    
    # 📧 ENVIAR EMAIL según el nuevo estado
    email_enviado = False
    if nuevo_estado == 'CONFIRMADA':
        email_enviado = enviar_email_confirmacion(reserva)
    elif nuevo_estado == 'CANCELADA':
        email_enviado = enviar_email_cancelacion(reserva)
    
    return Response({
        'message': f'Reserva {nuevo_estado.lower()} exitosamente',
        'reserva_id': reserva.id,
        'nuevo_estado': reserva.get_estado_display(),
        'cliente': reserva.cliente.nombre,
        'email_enviado': email_enviado
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def listar_reservas_admin(request):
    """
    Lista reservas filtradas por estado.
    Uso: /api/admin/reservas/?estado=PENDIENTE
         /api/admin/reservas/?estado=CONFIRMADA
         /api/admin/reservas/?estado=CANCELADA
         /api/admin/reservas/ (todas)
    """
    estado = request.query_params.get('estado', None)
    
    if estado:
        if estado not in ['PENDIENTE', 'CONFIRMADA', 'CANCELADA']:
            return Response({'error': 'Estado inválido'}, status=400)
        reservas = Reserva.objects.filter(estado=estado)
    else:
        reservas = Reserva.objects.all()
    
    reservas = reservas.order_by('-fecha_reserva')
    
    serializer = ReservaSerializer(reservas, many=True)
    
    return Response({
        'total': reservas.count(),
        'reservas': serializer.data
    })


@api_view(['GET'])
def detalle_reserva_admin(request, reserva_id):
    """
    Obtiene el detalle completo de una reserva por su ID.
    Uso: GET /api/admin/reservas/{reserva_id}/
    """
    try:
        reserva = Reserva.objects.get(pk=reserva_id)
    except Reserva.DoesNotExist:
        return Response(
            {'error': 'Reserva no encontrada'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = ReservaSerializer(reserva)
    return Response(serializer.data)


from rest_framework import viewsets

# Create your views here.
# VIEWSETS
# ---------------------------------------------- HABITACION ---------------------------------------------
class TipoHabitacionViewSet(viewsets.ModelViewSet):
    queryset = TipoHabitacion.objects.all().order_by('nombre') # Obtener la informacion
    serializer_class = TipoHabitacionSerializer   
    lookup_field = 'pk'


class HabitacionViewSet(viewsets.ModelViewSet):
    queryset = Habitacion.objects.all().order_by('numero') # Obtener la informacion
    serializer_class = HabitacionSerializer
    lookup_field = 'pk'

# ---------------------------------------------- SALA ---------------------------------------------
class SalaViewSet(viewsets.ModelViewSet):
    queryset = Sala.objects.all()
    serializer_class = SalaSerializer
    lookup_field = 'id'

class TipoSalaViewSet(viewsets.ModelViewSet):
    queryset = TipoSala.objects.all()
    serializer_class = TipoSalaSerializer
    lookup_field = 'id'

#----------- RESERVA API VIEWS -----------
#Habitacion
class ReservaHabitacionView(APIView):
    def get(self, request):
        reservas = Reserva.objects.all()
        if not reservas:
            print("Hasta el momento no hay reservas disponibles")
            return Response({"mensaje": "No hay reservas disponibles"}, status=status.HTTP_200_OK)
        return Response({"reservas": [r.id for r in reservas]})
    
    def post(self,request):
        clientes,error = obtener_o_crear_cliente(request)
        if error:
            return error
        nueva_reserva = Reserva.objects.create(
            cliente=clientes,
            tipo_reserva="HABITACION",
            fecha_reserva=date.today()
        )
        serializer = ReservaHabitacionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(reserva=nueva_reserva)
            return Response({
                "mensaje": "Reserva pendiente por confirmar",
                "numero_de_reserva": nueva_reserva.id,
                "confirmacion": clientes.email
            },status=201)
        return Response(serializer.errors, status=400)
#Sala
class ReservaSalaView(APIView):

    def post(self, request):

        clientes, error = obtener_o_crear_cliente(request)
        if error:
            return error

        nueva_reserva = Reserva.objects.create(
            cliente=clientes,
            tipo_reserva="SALA",
            fecha_reserva=date.today()
        )

        serializer = ReservaSalaSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(reserva=nueva_reserva)

            return Response({
                "mensaje": f"Reserva de sala creada #{nueva_reserva.id}",
                "confirmacion_a": clientes.email
            }, status=201)

        return Response(serializer.errors, status=400)
    
    


class HabitacionListView(ListAPIView):
    def get_queryset(self):
        return Habitacion.objects.filter(estado="DISPONIBLE")
    serializer_class = HabitacionSerializer

class SalaListView(ListAPIView):
    def get_queryset(self):
        return Sala.objects.filter(estado="DISPONIBLE")
    serializer_class = SalaSerializer

