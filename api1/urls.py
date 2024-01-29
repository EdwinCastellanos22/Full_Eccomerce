from django.urls import path
from rest_framework_simplejwt import views
from .views import Protected, RegisterView, ProductosView, CarritoView, GetUsername, ProductGet, MyObtenTokenPairView


urlpatterns = [
    path('token/', MyObtenTokenPairView.as_view() , name="Obtener Token"),
    path('register/', RegisterView.as_view(), name='Registro'),
    path('token/refresh/', views.TokenRefreshView.as_view(), name="Refrescar token"),
    path("token/verify/", views.TokenVerifyView.as_view(), name="Verificar token"),
    path('protected/', Protected.as_view(), name="Vista Protegida"),
    path('products/', ProductosView.as_view(), name='Productos'),
    path("product/<int:pid>", ProductGet.as_view(), name="Ver Producto"),
    path("car/", CarritoView.as_view(), name="Carrito de Compras"),
    path("getUser/", GetUsername.as_view(), name="Obtener Usuario actual"),
]
