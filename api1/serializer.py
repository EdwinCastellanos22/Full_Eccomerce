from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from .models import Producto, Carrito
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyObtainTokenPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token= super().get_token(user)
        token['username']= user.username
        token['email']= user.email

        return token

class RegisterSerializaer(serializers.ModelSerializer):

    email= serializers.EmailField(
        required= True,
        validators= [UniqueValidator(queryset=User.objects.all())]
    )
    password= serializers.CharField(
        write_only= True,
        required= True,
        validators= [validate_password]
    )
    password2= serializers.CharField(
        write_only= True,
        required= True,
    )

    class Meta:
        model= User
        fields= ('username', 'password', 'password2', 'email')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                "password": "password not equals"
            })
        return attrs
    
    def create(self, validate_data):
        user= User.objects.create(
            username= validate_data['username'],
            email= validate_data['email']
        )
        user.set_password(validate_data['password'])
        user.save()

        return user

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model= Producto
        fields= ['pid', 'nombre','descripcion','precio']

class CarritoSerializer(serializers.ModelSerializer):
    class Meta:
        model= Carrito
        fields= ['cid','user', 'producto', 'cantidad', 'precio_total']