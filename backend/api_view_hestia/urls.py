from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter
from .views import TipoHabitacionViewSet, HabitacionViewSet, SalaViewSet, TipoSalaViewSet,ReservaHabitacionView,HabitacionListView,SalaListView
from .views import ContactoAPIView


router = DefaultRouter() 
router.register(r'tipos-habitacion', TipoHabitacionViewSet, basename='tipos-habitacion') 
router.register(r'habitaciones', HabitacionViewSet, basename='habitaciones')

router.register(r'salas', SalaViewSet, basename='salas')
router.register(r'tipo-salas', TipoSalaViewSet, basename='tipo-salas')

#API VIEWS URLS 
urlpatterns = [
    path('admin/reservas/pendientes/', views.listar_reservas_pendientes, name='admin-reservas-pendientes'),
    path('admin/reservas/<int:reserva_id>/estado/', views.cambiar_estado_reserva, name='cambiar-estado-reserva'),
    path('admin/reservas/', views.listar_reservas_admin, name='listar-reservas-admin'), 
    path('admin/reservas/<int:reserva_id>/', views.detalle_reserva_admin, name='detalle-reserva-admin'),
    path('reserva-habitacion/', ReservaHabitacionView.as_view()),
    path('contacto/', ContactoAPIView.as_view(), name='api-contacto'),
    path('habitaciones/', HabitacionListView.as_view()),
    path('salas/', SalaListView.as_view()),
]

urlpatterns = router.urls + urlpatterns

