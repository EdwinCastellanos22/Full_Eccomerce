from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Producto(models.Model):
    pid= models.AutoField(primary_key=True)
    nombre= models.CharField(max_length=150)
    descripcion= models.TextField()
    precio= models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.nombre
    
class Carrito(models.Model):
    cid= models.AutoField(primary_key=True)
    user= models.ForeignKey(User, on_delete=models.CASCADE)
    producto= models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad= models.IntegerField(default=1)
    precio_total= models.DecimalField(max_digits=10, decimal_places=2)
