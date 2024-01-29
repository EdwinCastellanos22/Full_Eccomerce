from django.urls import path
from .views import index, carrito

urlpatterns = [
    path('index/', index),
    path('carrito/', carrito),
]
