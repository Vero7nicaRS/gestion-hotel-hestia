from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter
from .views import TipoSalaList, SalaList

# ROUTER VIEWSET
router = DefaultRouter() 

urlpatterns = router.urls


#------ API VIEWS URLS -------
urlpatterns = [
    path('tipos-sala/', TipoSalaList.as_view(), name='tipos-sala'),
    path('salas/', SalaList.as_view(), name='salas'),
    path('admin/reservas/pendientes/', views.listar_reservas_pendientes, name='admin-reservas-pendientes'),
    path('admin/reservas/<int:reserva_id>/estado/', views.cambiar_estado_reserva, name='cambiar-estado-reserva'),
    path('admin/reservas/', views.listar_reservas_admin, name='listar-reservas-admin'), 
    path('admin/reservas/<int:reserva_id>/', views.detalle_reserva_admin, name='detalle-reserva-admin'),

]

