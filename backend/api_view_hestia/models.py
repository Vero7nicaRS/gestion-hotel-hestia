from django.db import models


class TipoHabitacion(models.Model):
    nombre = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.CharField(max_length=250, blank=True)
    
    def __str__(self):
        return f"{self.nombre} - ${self.precio}"
    
    class Meta:
        ordering = ['nombre']
    
    
class Habitacion(models.Model):
    numero = models.CharField(max_length=10, unique=True)
    tipo_habitacion = models.ForeignKey(TipoHabitacion, on_delete=models.CASCADE) 
    class Estado(models.TextChoices):
        DISPONIBLE = "DISPONIBLE", "Disponible"
        OCUPADA = "OCUPADA", "Ocupada"
    estado = models.CharField(max_length=20, choices=Estado.choices, default=Estado.DISPONIBLE)

    def __str__(self):
        return f"Habitación {self.numero} - {self.tipo_habitacion.nombre}"
    class Meta:
        ordering = ['numero']
    
class TipoSala(models.Model):
    nombre = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.CharField(max_length=250, blank=True) 
    
    def __str__(self):
        return f"{self.nombre} - ${self.precio}"
    class Meta:
        ordering = ['nombre']
    
class Sala(models.Model):
    numero = models.CharField(max_length=10, unique=True)
    tipo_sala = models.ForeignKey(TipoSala, on_delete=models.CASCADE) 
    class Estado(models.TextChoices):
        DISPONIBLE = "DISPONIBLE", "Disponible"
        OCUPADA = "OCUPADA", "Ocupada"
    estado = models.CharField(max_length=20, choices=Estado.choices, default=Estado.DISPONIBLE)

    def __str__(self):
        return f"Sala {self.numero} - {self.tipo_sala.nombre}"
    class Meta:
        ordering = ['numero', 'estado']

class Cliente(models.Model):
    nombre = models.CharField(max_length=100)
    email = models.EmailField(max_length=65, unique=True)
    telefono = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return self.nombre
    class Meta:
        ordering = ['nombre']
 
class Reserva(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE) 
    class TipoReserva(models.TextChoices):
        HABITACION = "HABITACION", "Habitación"
        SALA = "SALA", "Sala"
    class Estado(models.TextChoices):
        PENDIENTE = "PENDIENTE", "Pendiente"
        CONFIRMADA = "CONFIRMADA", "Confirmada"
        CANCELADA = "CANCELADA", "Cancelada"
    estado = models.CharField(max_length=20, choices=Estado.choices, default=Estado.PENDIENTE)
    tipo_reserva = models.CharField(max_length=20, choices=TipoReserva.choices)
    fecha_reserva = models.DateField()

    def __str__(self):
        return f"Reserva # {self.id} de {self.cliente.nombre} para {self.tipo_reserva} en la fecha {self.fecha_reserva}"
    class Meta:
        ordering = ['fecha_reserva', 'estado']
        
class ReservaHabitacion(models.Model):
    habitacion = models.ForeignKey(Habitacion, on_delete=models.CASCADE) 
    reserva =models.OneToOneField(Reserva, on_delete=models.CASCADE) 
    numero_personas = models.PositiveIntegerField()
    fecha_entrada = models.DateField()
    fecha_salida = models.DateField()

    def __str__(self):
        return(
            f"Reserva de {self.reserva.cliente.nombre} para habitación {self.habitacion.numero} "
            f"desde {self.fecha_entrada} hasta {self.fecha_salida}"
        ) 
    
    class Meta:
        ordering = ['fecha_entrada', 'fecha_salida']

class ReservaSala(models.Model):
    sala = models.ForeignKey(Sala, on_delete=models.CASCADE) 
    reserva =models.OneToOneField(Reserva, on_delete=models.CASCADE) 
    numero_personas = models.PositiveIntegerField()
    fecha_uso = models.DateField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()

    def __str__(self):  
        return(
            f"Reserva de {self.reserva.cliente.nombre} para sala {self.sala.numero} "
            f"el {self.fecha_uso} de {self.hora_inicio} a {self.hora_fin}"
        ) 
    class Meta:
        ordering = ['fecha_uso', 'hora_inicio']


        
