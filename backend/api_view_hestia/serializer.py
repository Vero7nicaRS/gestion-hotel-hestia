from rest_framework import serializers
from .models import Habitacion, TipoHabitacion, TipoSala, Sala, Cliente, Reserva, ReservaSala, ReservaHabitacion


class TipoHabitacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoHabitacion
        fields = ['id', 'nombre', 'precio', 'descripcion']
        read_only_fields = ['id']


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
    idtipo_sala=TipoHabitacionSerializer(read_only=True)
    class Meta:
        model = Sala
        fields = ['id', 'numero', 'tipo_sala', 'estado']
        read_only_fields = ['id']

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id', 'nombre', 'email', 'telefono']
        read_only_fields = ['id']

class ReservaSerializer(serializers.ModelSerializer):
    cliente = ClienteSerializer(read_only=True)
    estado= serializers.CharField(source='get_estado_display', read_only=True)
    tipo_reserva_display = serializers.CharField(source='get_tipo_reserva_display', read_only=True)
    class Meta:
        model = Reserva
        fields = ['id', 'cliente','estado','tipo_reserva','tipo_reserva_display','fecha_reserva']
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
        read_only_fields = ['id','reserva']

from rest_framework import serializers

class ContactoSerializer(serializers.Serializer):
    nombre = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    mensaje = serializers.CharField(max_length=2000)