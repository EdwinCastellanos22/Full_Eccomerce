from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .serializer import RegisterSerializaer, ProductSerializer, CarritoSerializer, MyObtainTokenPairSerializer
from rest_framework import generics, status
from django.contrib.auth.models import User
from .models import Producto, Carrito
from rest_framework_simplejwt.views import TokenObtainPairView


# Create your views here.

class MyObtenTokenPairView(TokenObtainPairView):
    serializer_class= MyObtainTokenPairSerializer


class Protected(APIView):
    permission_classes= (IsAuthenticated,)

    def get(self, request):
        return Response({
            "message":"Esta vista esta protegida"
        })
    
    def post(self, request):
        data= request.data
        return Response({
            "message":"Metodo post permitido",
            "data": data,
        })

class RegisterView(generics.CreateAPIView):
    queryset= User.objects.all()
    permission_classes= (AllowAny,)
    serializer_class= RegisterSerializaer


class GetUsername(APIView):
    permission_classes= (IsAuthenticated,)

    def get(self,request):
        username= request.user.username
        return Response({
            "username":username
        })



class ProductosView(APIView):

    permission_classes= (IsAuthenticated,)

    def get(self, request):
        productos= Producto.objects.all()
        serializer= ProductSerializer(productos, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer= ProductSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class ProductGet(APIView):

    permission_classes= (IsAuthenticated, )

    def get(self, request, pid):
        producto= Producto.objects.get(pid= pid)
        serializer= ProductSerializer(producto)
        return Response(serializer.data)

class CarritoView(APIView):
    permission_classes= (IsAuthenticated,)

    def get(self, request):
        items= Carrito.objects.filter(user= request.user)
        serializer= CarritoSerializer(items, many=True) 
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        producto_id= request.data.get('pid')
        cantidad= request.data.get('cantidad',1)
        producto= Producto.objects.get(pid= producto_id)
        precioTotal= producto.precio * cantidad
        item_carrito= Carrito(user= request.user, producto= producto, cantidad= cantidad, precio_total= precioTotal)
        item_carrito.save()
        serializer= CarritoSerializer(item_carrito)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def delete(self, request):
        carrito_id= request.data.get('cid')
        item_carrito= Carrito.objects.get(cid= carrito_id, user= request.user)
        item_carrito.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

