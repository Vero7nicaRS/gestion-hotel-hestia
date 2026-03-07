from rest_framework import serializers
from .models import Cliente, Habitacion, Reserva, ReservaHabitacion, ReservaSala, Sala, TipoHabitacion, TipoSala 

#----------- SERIALIZERS -----------

#----------- HABITACION API SERIALIZERS -----------
class TipoHabitacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoHabitacion
        fields = ['id', 'nombre', 'precio', 'descripcion']
        read_only_fields = ['id']

class HabitacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habitacion
        fields = ['id', 'numero', 'idtipo_habitacion', 'estado']
        read_only_fields = ['id']

#----------- SALA API SERIALIZERS -----------
class TipoSalaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoSala
        fields = ['id', 'nombre', 'precio', 'descripcion']
        read_only_fields = ['id']

class SalaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sala
        fields = ['id', 'numero', 'idtipo_sala', 'estado']
        read_only_fields = ['id']

#----------- CLIENTE API SERIALIZERS -----------
class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id', 'nombre', 'email', 'telefono']
        read_only_fields = ['id']

#----------- RESERVA API SERIALIZERS -----------
class ReservaSerializer(serializers.ModelSerializer):
    cliente = ClienteSerializer(read_only=True)
    class Meta:
        model = Reserva
        fields = ['id', 'cliente','estado','tipo_reserva','fecha_reserva']
        read_only_fields = ['id']

class ReservaSalaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservaSala
        fields = ['id', 'reserva', 'sala','numero_personas','fecha_uso', 'hora_inicio', 'hora_fin']
        read_only_fields = ['id']

class ReservaHabitacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservaHabitacion
        fields = ['id', 'reserva', 'habitacion','numero_personas','fecha_entrada', 'fecha_salida']
        read_only_fields = ['id']