from django.contrib import admin
from .models import (
    TipoHabitacion, 
    Habitacion, 
    TipoSala, 
    Sala, 
    Cliente, 
    Reserva, 
    ReservaHabitacion, 
    ReservaSala
)

# REGISTRO DE MODELOS EN EL ADMIN

@admin.register(TipoHabitacion)
class TipoHabitacionAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre', 'precio', 'descripcion']
    search_fields = ['nombre']

@admin.register(Habitacion)
class HabitacionAdmin(admin.ModelAdmin):
    list_display = ['id', 'numero', 'tipo_habitacion', 'estado']
    list_filter = ['estado', 'tipo_habitacion']
    search_fields = ['numero']

@admin.register(TipoSala)
class TipoSalaAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre', 'precio', 'descripcion']
    search_fields = ['nombre']

@admin.register(Sala)
class SalaAdmin(admin.ModelAdmin):
    list_display = ['id', 'numero', 'tipo_sala', 'estado']
    list_filter = ['estado', 'tipo_sala']
    search_fields = ['numero']

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre', 'email', 'telefono']
    search_fields = ['nombre', 'email']

@admin.register(Reserva)
class ReservaAdmin(admin.ModelAdmin):
    list_display = ['id', 'cliente', 'tipo_reserva', 'estado', 'fecha_reserva']
    list_filter = ['estado', 'tipo_reserva', 'fecha_reserva']
    search_fields = ['cliente__nombre', 'cliente__email']
    date_hierarchy = 'fecha_reserva'

@admin.register(ReservaHabitacion)
class ReservaHabitacionAdmin(admin.ModelAdmin):
    list_display = ['id', 'reserva', 'habitacion', 'numero_personas', 'fecha_entrada', 'fecha_salida']
    list_filter = ['fecha_entrada', 'fecha_salida']
    search_fields = ['habitacion__numero', 'reserva__cliente__nombre']

@admin.register(ReservaSala)
class ReservaSalaAdmin(admin.ModelAdmin):
    list_display = ['id', 'reserva', 'sala', 'numero_personas', 'fecha_uso', 'hora_inicio', 'hora_fin']
    list_filter = ['fecha_uso']
    search_fields = ['sala__numero', 'reserva__cliente__nombre']
