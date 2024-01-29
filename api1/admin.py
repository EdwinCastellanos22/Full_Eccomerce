from django.contrib import admin
from .models import Producto, Carrito 

# Register your models here.
admin.site.register(Producto)
admin.site.register(Carrito)