from django.shortcuts import render
from .models import Habitacion, TipoHabitacion, TipoSala, Sala, Cliente, Reserva, ReservaSala, ReservaHabitacion
from .serializer import HabitacionSerializer, TipoHabitacionSerializer, TipoSalaSerializer, SalaSerializer, ClienteSerializer, ReservaSerializer, ReservaSalaSerializer, ReservaHabitacionSerializer

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
