from django.db import models

# Create your models here.
class Temperature(models.Model):
    date = models.DateTimeField()
    temperature = models.FloatField()

    def __str__(self):
        return f"{self.temperature}°C on {self.date}"
    

class Humidity(models.Model):
    date = models.DateTimeField()
    humidity = models.FloatField()

    def __str__(self):
        return f"{self.humidity}% on {self.date}"   
    

class Voltage(models.Model):
    date = models.DateTimeField()
    voltage = models.FloatField()

    def __str__(self):
        return f"{self.voltage} V on {self.date}"
    
class  Current(models.Model):
    date = models.DateTimeField()
    current = models.FloatField()

    def __str__(self):
        return f"{self.current} A on {self.date}"    


class Card(models.Model):
    card_choice = [
        ('card-1', 'card-1'),
        ('card-2', 'card-2'), 
        ('card-3', 'card-3'),
        ('card-4', 'card-4')
    ]
    card_id = models.CharField(max_length=10, choices=card_choice, unique=True)
    card_name = models.CharField(max_length=50)
    card_value = models.FloatField(default=0.0)

    def __str__(self):
        return f"{self.card_name} {self.card_id} - {self.card_value}"


#baad mei use krege


# class Pressure(models.Model):
#     date = models.DateTimeField()
#     pressure = models.FloatField()

#     def __str__(self):
#         return f"{self.pressure} hPa on {self.date}"

# class ph(models.Model):
#     date = models.DateTimeField()
#     ph = models.FloatField()        

#     def __str__(self):
#         return f"{self.ph} pH on {self.date}"
    

# class air_quality(models.Model):
#     date = models.DateTimeField()
#     air_quality_index = models.FloatField()

#     def __str__(self):
#         return f"Air Quality Index: {self.air_quality_index} on {self.date}"    
    
# class frequency(models.Model):
#     date = models.DateTimeField()
#     frequency = models.FloatField()

#     def __str__(self):
#         return f"Frequency: {self.frequency} Hz on {self.date}"    
# class battery_voltage(models.Model):
#     date = models.DateTimeField()
#     battery_voltage = models.FloatField()

#     def __str__(self):
#         return f"Battery Voltage: {self.battery_voltage} V on {self.date}"