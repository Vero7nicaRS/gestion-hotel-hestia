from rest_framework.views import APIView
from .models import Habitacion, TipoHabitacion, Sala, TipoSala, Cliente, Reserva, ReservaHabitacion
from .serializer import HabitacionSerializer, TipoHabitacionSerializer, SalaSerializer, TipoSalaSerializer, ClienteSerializer, ReservaHabitacionSerializer,ReservaSalaSerializer
from datetime import date
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView

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
#----------- HABITACION API VIEWS -----------



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

