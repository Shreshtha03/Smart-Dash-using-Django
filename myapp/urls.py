from django.urls import path , include
from .views import TemperatureViewSet, HumidityViewSet, VoltageViewSet, CurrentViewSet, CardViewSet
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'Temperature', TemperatureViewSet)
router.register(r'Humidity', HumidityViewSet)
router.register(r'Voltage', VoltageViewSet)
router.register(r'Current', CurrentViewSet)
router.register(r'Card', CardViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
