from django.shortcuts import render
from rest_framework import viewsets
from .models import Temperature, Humidity, Voltage, Current, Card
from .serializers import TemperatureSerializer, HumiditySerializer, VoltageSerializer, CurrentSerializer, CardSerializer


# Create your views here.
class TemperatureViewSet(viewsets.ModelViewSet):
    queryset = Temperature.objects.all()
    serializer_class = TemperatureSerializer


class HumidityViewSet(viewsets.ModelViewSet):
    queryset = Humidity.objects.all()
    serializer_class = HumiditySerializer


class VoltageViewSet(viewsets.ModelViewSet):
    queryset = Voltage.objects.all()
    serializer_class = VoltageSerializer


class CurrentViewSet(viewsets.ModelViewSet):
    queryset = Current.objects.all()
    serializer_class = CurrentSerializer


class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    lookup_field = 'card_id'  # Use card_id instead of id for lookups