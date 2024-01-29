//Variable de pago
var pagar = 0;

//CONFIGURACION DE HEADERS
let headers = {};
let token = "";
if (localStorage.getItem("token")) {
  token = "Bearer " + localStorage.getItem("token");

  headers = {
    Accept: "*/*",
    Authorization: token,
  };
}

//REGISTRAR USUARIO
const registerUser = () => {
  let username = document.querySelector("#registerusername").value;
  let email = document.querySelector("#registeremail").value;
  let password = document.querySelector("#registerpassword").value;
  let passwordRepeat = document.querySelector("#registerrepeat").value;

  if (password != passwordRepeat) {
    Swal.fire("Las contraseñas no coinciden");
  } else {
    if (username != "" && email != "" && password != "") {
      fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          password2: passwordRepeat,
          email: email,
        }),
      })
        .then((response) => {
          if (response.status == 201) {
            Swal.fire({
              icon: "success",
              title: "Hecho",
              text: "Usuario Creado con Exito",
              showConfirmButton: false,
              timer: 1500,
            });
            location.reload();
          } else {
            response.json().then((data) => {
              console.log(data);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "A ocurrido un error",
                showConfirmButton: false,
                timer: 1500,
              });
            });
          }
        })
        .catch((error) => console.log(username, email, error));
    } else {
      Swal.fire("Pro favor rellena los campos");
    }
  }
};

//OBTENER TOKEN JWT
const getToken = () => {
  let username = document.querySelector("#username").value;
  let password = document.querySelector("#password").value;
  if (username != "" && password != "") {
    fetch("http://localhost:8000/api/token/", {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => {
        if (response.status == 200) {
          response.json().then((data) => {
            localStorage.setItem("token", data.access);
            localStorage.setItem("refresh", data.refresh);
            Swal.fire({
              icon: "success",
              title: "Hola",
              text: "Bienvenido de Nuevo",
              showConfirmButton: false,
              timer: 1500,
            });
            location.reload();
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "A ocurrido un problema",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((error) => console.log(error));
  } else {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Llena los campos",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

//VERIFICAR SI EL TOKEN EXPIRO
const verifyToken = () => {
  fetch("http://localhost:8000/api/token/verify/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: localStorage.getItem("token"),
    }),
  })
    .then((response) => {
      if (response.status == 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Token",
          text: "El token aun no ha expirado",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Token",
          text: "El token ha expirado",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    })
    .catch((error) => Swal.fire(error));
};

//REFRESCAR TOKEN
const refreshToken = () => {
  fetch("http://localhost:8000/api/token/refresh/", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      refresh: localStorage.getItem("refresh"),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      localStorage.removeItem("token");
      localStorage.setItem("token", data.access);
    })
    .catch((error) => Swal.fire(error));
  location.reload();
};

//AGREGAR AL CARRITO
let cant = 1;
const aggCarrito = async (pid) => {
  const { value: cantidad } = await Swal.fire({
    title: "Cantidad",
    input: "number",
    inputPlaceholder: "Cantidad",
    confirmButtonText: "Agregar",
  });
  if (cantidad > 0) {
    let c = parseInt(cantidad);
    if (c <= 0) {
      c = 1;
    }
    cant = c;
  }else{
    Swal.fire({
      icon:"error",
      title:"Error",
      text:"Ingrese un valor valido",
      showConfirmButton: false,
      timer: 1500
    })
  }

  await fetch("http://localhost:8000/api/car/", {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pid: pid,
      cantidad: cant,
    }),
  })
    .then((response) => {
      if (response.status == 201) {
        Swal.fire({
          icon: "success",
          title: "Hecho",
          text: "Producto agregado correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Producto no agregado",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    })
    .catch((error) => console.log(error));
};

//ELIMINAR ITEM DE EL CARRITO
const eliminar = (cid, precio) => {
  fetch("http://localhost:8000/api/car/", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      cid: cid,
    }),
  })
    .then((response) => {
      if (response.status == 204) {
        let pre = parseFloat(precio);
        pagar = pagar - pre;
        $("#pagar").html(pagar.toFixed(2));
        $("#" + cid).remove();
        Swal.fire({
          icon: "info",
          title: "Hecho",
          text: "Producto Eliminado",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    })
    .catch((error) => console.log(error));
};

//MOSTRAR LOS PRODUCTOS
const getProducts = async () => {
  let container = document.getElementById("celda");
  await fetch("http://localhost:8000/api/products/", {
    method: "GET",
    headers: headers,
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        const celda = document.createElement("tr");

        const nombre = document.createElement("td");
        nombre.textContent = item.nombre;
        const descr = document.createElement("td");
        descr.textContent = item.descripcion;
        const precio = document.createElement("td");
        precio.textContent = "Q" + item.precio;

        const carrito = document.createElement("td");
        const button = document.createElement("button");
        button.onclick = aggCarrito.bind(this, item.pid);
        button.className = "btn btn-outline btn-secondary text-white m-2";
        button.innerHTML =
          "<div><svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' class='stroke-current flex-shrink-0 w-6 h-6'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'></path></svg></div>";
        carrito.append(button);

        celda.append(nombre);
        celda.append(descr);
        celda.append(precio);
        celda.append(carrito);

        container.append(celda);
      });
    })
    .catch((error) => console.log("Error: " + error));
  await $(".datatable").DataTable();
};

//MOSTRAR TOKEN JWT
const showHeaders = () => {
  Swal.fire(headers.Authorization);
};

//CERRAR SESION
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
  location.reload();
};

//OBTENER  NOMBRE DE USUARIO
let us = document.querySelector("#user");
const setUser = () => {
  fetch("http://localhost:8000/api/getUser/", {
    method: "GET",
    headers: headers,
  })
    .then((response) => response.json())
    .then((data) => {
      us.innerHTML = data.username;
    })
    .catch((error) => {
      us.innerHTML = "Username";
    });
};

//OBTENER LISTA DE CARRITO DE COMPRAS

const obtenerCarrito = () => {
  const carritoC = document.querySelector("#carritoC");
  const token = localStorage.getItem("token");
  const pagarSpan = document.querySelector("#pagar");

  if (!token) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Obten token Primero",
    });
    $("$proceder").hide();
  } else {
    fetch("http://localhost:8000/api/car/", {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          const celda = document.createElement("tr");
          celda.id = item.cid;

          let lProducto = document.createElement("td");
          let lPrecio = document.createElement("td");

          fetch("http://localhost:8000/api/product/" + item.producto, {
            method: "GET",
            headers: headers,
          })
            .then((response) => response.json())
            .then((data) => {
              lProducto.append(data.nombre);
              lPrecio.append(data.precio);
            })
            .catch((error) => console.log(error));

          const lCantidad = document.createElement("td");
          lCantidad.append(item.cantidad);

          const lPrecioTotal = document.createElement("td");
          lPrecioTotal.append("Q" + item.precio_total);

          const accion = document.createElement("td");
          const boton = document.createElement("button");
          boton.innerHTML =
            "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash3' viewBox='0 0 16 16'><path d='M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z'/></svg>";
          boton.className = "btn btn-error btn-outline text-white m-2";
          boton.onclick = eliminar.bind(this, item.cid, item.precio_total);

          accion.append(boton);

          celda.append(lProducto);
          celda.append(lPrecio);
          celda.append(lCantidad);
          celda.append(lPrecioTotal);
          celda.append(accion);
          carritoC.append(celda);
          let total_pagar = parseFloat(item.precio_total);
          pagar = pagar + total_pagar;
          pagarSpan.innerHTML = pagar.toFixed(2);
        });
      })
      .catch((error) => console.error(error));
  }
};

const Eraser = () => {
  $("#carritoC").empty();
  pagar = 0;
};

//LOGICAS DE BOTONES
let obtenerToken = document.querySelector("#obtener-token");
let logo = document.querySelector("#logout");
let test = localStorage.getItem("token");
let alerta = document.querySelector("#alerta");
let showToken = document.querySelector("#showToken");
let tokenVerify = document.querySelector("#tokenVerify");
let refreshT = document.querySelector("#refreshT");
let register = document.querySelector("#register");

if (test) {
  getProducts();
  setUser();
  obtenerToken.hidden = true;
  alerta.hidden = true;
  register.hidden = true;
} else {
  showToken.hidden = true;
  tokenVerify.hidden = true;
  logo.hidden = true;
  refreshT.hidden = true;
  us.innerHTML = "Bienvenido";
  $("#carritoCompras").hide();
  $(".table").hide();
  $("#actToken").hide();
}

const pagarCarrito = () => {
  if (pagar == 0) {
    $(".tablaCarrito").hide();
    Swal.fire({
      icon: "info",
      title: "Sin Productos",
      text: "Agregue productos a su carrito",
      showConfirmButton: false,
      timer: 1500,
    });
  } else {
    Swal.fire({
      icon: "info",
      title: "En construccion",
      text: "Aun no configurado",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

$(document).ready(() => {
  if (token) {
    Swal.fire({
      icon: "success",
      title: "Bienvenido de nuevo",
      timer: 1500,
    });
  }
});

try {
  paypal
    .Buttons({
      style: {
        layout: "vertical",
        color: "blue",
        shape: "rect",
        label: "paypal",
      },
    })
    .render(".proceder");
} catch (error) {
  console.log(error);
}
