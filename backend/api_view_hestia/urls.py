from django.urls import path
from .views import  ReservaHabitacionView,HabitacionListView,ReservaSalaView,SalaListView


#------ API VIEWS URLS -------
urlpatterns = [
    path('reserva-sala/', ReservaSalaView.as_view()),
    path('salas/',SalaListView.as_view()),
    path('reserva-habitacion/', ReservaHabitacionView.as_view()),
    path('habitaciones/', HabitacionListView.as_view()),
]

