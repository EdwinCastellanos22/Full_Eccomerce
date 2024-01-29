from django.shortcuts import render, redirect
from django.http.response import HttpResponse

import paypalrestsdk
import logging

from api1.models import Carrito

# Create your views here.

def crear_pago(request):

    carrito= Carrito.objects.filter(user= request.user)

    return render(request, "pago/pago.html", {
        "carrito": carrito
    })

    

def paypal(request):
    paypalrestsdk.configure({
  "mode": "sandbox", # sandbox or live
  "client_id": "AUAReEPEJ8ynr4RSgq3a9HrfhvrJEBHF5jaUmByl96a6vnG_f71yi59pBb3G9IOKbvS6N99f35UeLDh3",
  "client_secret": "EEvCvg6uvCTlvJ-mOznyLrcMtEWfqbOYHOy3sUI3rcqvHlE3vOxB0ZCKVvQaK_baIbRIRtANiXdmDCw2" })

    payment = paypalrestsdk.Payment({
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"},
        "redirect_urls": {
            "return_url": "http://localhost:8000/pago/paypal/execute/",
            "cancel_url": "http://localhost:8000/web/"},
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "item",
                    "price": "5.00",
                    "currency": "USD",
                    "quantity": 1}]},
            "amount": {
                "total": "5.00",
                "currency": "USD"},
            "description": "This is the payment transaction description."}]})

    if payment.create():
        print("Payment created successfully")
        for link in payment.links:
             if link.rel == "approval_url":
                  approval= str(link.href)
                  return redirect(approval)
    else:
        print(payment.error)
        return HttpResponse("<h1>Error en la")
    
def execute_paypal(request):
     payment_id= request.GET['paymentId']
     payer_id= request.GET['PayerID']
     payment= paypalrestsdk.Payment.find(payment_id)
     if payment.execute({"payer_id": payer_id}):
         print(payment)
         return HttpResponse("Pago realizado")
     else:
          print(payment.error)
          return HttpResponse("pago error")
     

import stripe
def stripe_payment(request):
       stripe.api_key= "sk_test_51Mq2x4KuauYsGHRTKeDuR2Qu8eThbfgMyYQqy5zBPR7L77up17X0gkUeJZdQoDw8K73zFhpc7aaEByxMfUfQAp1A00dg55302b"

       stripe.PaymentIntent.create(
            amount=1099,
            currency='gtq',
            payment_method_types=['card'],
       )
       print(stripe)
       return render(request, 'index.html')