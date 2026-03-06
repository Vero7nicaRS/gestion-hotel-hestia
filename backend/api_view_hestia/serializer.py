from rest_framework import serializers
from .models import Habitacion, TipoHabitacion, TipoSala, Sala, Cliente, Reserva, ReservaSala, ReservaHabitacion


#                                   VALIDACIONES
# SERIALIZER: Se encarga de validar que los datos que se pasado por el JSON (body) ---> Postman
#             sean los correctos. Para que así, VIEW solamente tenga que implementar la funcionalidad
#             y no hacer comprobaciones.
#             Por tanto, el serializer se encarga de comprobar los datos de entrada (JSON - BODY)
# validate_<NOMBRE_DEL_CAMPO_A_VALIDAR>
# 
# Serializer: permite definir que información de nuestro modelo vamos a mover hacia delante o hacia atrás
# cuando el usuario interactue con nosotros. Y que limitaciones estamos imponiendo y validaciones adicionales.
# Después del serializer, hay que dirigirse a la vista.

class TipoHabitacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoHabitacion
        fields = ['id', 'nombre', 'precio', 'descripcion']
        read_only_fields = ['id']


# Lo que se recibe del JSON (body):
# {
#  "id": 1,
#  "numero": "253",
#  "estado": "DISPONIBLE",
#  "tipo_habitacion": 3
#}     ||
#      \/ (Lo que tiene "tipo_habitacion")
#  "tipo_habitacion": {
#    "id": 3,
#    "nombre": "Doble",
#    "precio": "90.00",
#    "descripcion": "Habitación con literas."
#  }
#}
class HabitacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habitacion
        fields = ['id', 'numero', 'tipo_habitacion', 'estado']
        read_only_fields = ['id']

class TipoSalaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoSala
        fields = ['id', 'nombre', 'precio', 'descripcion']
        read_only_fields = ['id']

class SalaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sala
        fields = ['id', 'numero', 'tipo_sala', 'estado']
        read_only_fields = ['id']

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id', 'nombre', 'email']
        read_only_fields = ['id']

class ReservaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserva
        fields = ['id', 'idcliente','estado','tipo_reserva','fecha_reserva']
        read_only_fields = ['id']

class ReservaSalaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservaSala
        fields = ['id', 'idreserva', 'idsala','numero_personas','fecha_uso', 'hora_inicio', 'hora_fin']
        read_only_fields = ['id']

class ReservaHabitacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservaHabitacion
        fields = ['id', 'idreserva', 'idhabitacion','numero_personas','fecha_entrada', 'fecha_salida']
        read_only_fields = ['id']