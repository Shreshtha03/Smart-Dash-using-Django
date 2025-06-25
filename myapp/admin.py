from django.contrib import admin
from .models import Temperature, Humidity, Voltage, Current , Card
from import_export.admin import ImportExportModelAdmin



@admin.register(Temperature)
class TemperatureAdmin(ImportExportModelAdmin):
    list_display = ('date', 'temperature')
    search_fields = ('date', 'temperature')


@admin.register(Humidity)
class HumidityAdmin(ImportExportModelAdmin):
    list_display = ('date', 'humidity')
    search_fields = ('date', 'humidity')
    

@admin.register(Voltage)
class VoltageAdmin(ImportExportModelAdmin):
    list_display = ('date', 'voltage')
    search_fields = ('date', 'voltage')


@admin.register(Current)
class CurrentAdmin(ImportExportModelAdmin):
    list_display = ('date', 'current')
    search_fields = ('date', 'current')

@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ('card_id', 'card_name', 'card_value')
    search_fields = ('card_id', 'card_name', 'card_value')