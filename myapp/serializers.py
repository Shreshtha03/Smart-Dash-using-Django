from rest_framework import serializers
from .models import Temperature, Humidity, Voltage, Current, Card

class TemperatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Temperature
        fields = '__all__'


class HumiditySerializer(serializers.ModelSerializer):
    class Meta:
        model = Humidity
        fields = '__all__'


class VoltageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Voltage
        fields = '__all__'


class CurrentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Current
        fields = '__all__'


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['card_id', 'card_name', 'card_value']