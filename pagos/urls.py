from django.urls import path
from .views import crear_pago, paypal, stripe_payment, execute_paypal

urlpatterns = [
    path("", crear_pago, name="crear pago"),
    path("paypal/", paypal, name="paypal"),
    path("paypal/execute/", execute_paypal),
    path("stripe/", stripe_payment),
]
