from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import TipoHabitacionViewSet, HabitacionViewSet, SalaViewSet, TipoSalaViewSet

# ROUTER VIEWSET
router = DefaultRouter() 
# Registrar en el router los endpoints que queremos
router.register(r'tipos-habitacion', TipoHabitacionViewSet, basename='tipos-habitacion') 
router.register(r'habitaciones', HabitacionViewSet, basename='habitaciones')

router.register(r'salas', SalaViewSet, basename='salas')
router.register(r'tipo-salas', TipoSalaViewSet, basename='tipo-salas')

urlpatterns = router.urls

