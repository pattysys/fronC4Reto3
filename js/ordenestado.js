let userId;
let orders = [];
let products = [];
let quantities=[];
/**
 * Establece el aspecto inicial de la interfaz
 */
function estadoInicial() {
  $("#alerta").hide();
  $("#procesarOrden").hide();
  $("#pedido").hide();
  $("#pedido").html("");
  $("#listado").hide();

  let user = sessionStorage.getItem("user");

  if (user == null) location.href = "index.html";
  else {
    let userJS = JSON.parse(user);
    userId = userJS.id;
    let typeUser;

    if (userJS.type == "ASE") typeUser = "ASESOR";
    else location.href = "index.html";

    $("#nameUser").html(userJS.name);
    $("#emailUser").html(userJS.email);
    $("#typeUser").html(typeUser);
  }
}

/**
 * Invoca servicio Web que se encarga de recuperar las ordenes x estado y asesor
 */
function listar() {
  let estadoOrden = $("#estadoOrden").val();

  $.ajax({
    // la URL para la petición (url: "url al recurso o endpoint")
    url: `http://localhost:8080/api/order/state/${estadoOrden}/${userId}`,

    // especifica el tipo de petición http: POST, GET, PUT, DELETE
    type: "GET",

    // el tipo de información que se espera de respuesta
    dataType: "json",

    // código a ejecutar si la petición es satisfactoria;
    // la respuesta es pasada como argumento a la función
    success: function (respuesta) {
      //recibe el arreglo 'items' de la respuesta a la petición
      console.log(respuesta);
      listarProductos(respuesta);
    },

    // código a ejecutar si la petición falla;
    // son pasados como argumentos a la función
    // el objeto de la petición en crudo y código de estatus de la petición
    error: function (xhr, status) {
      $("#alerta").html(
        "Ocurrio un problema al ejecutar la petición..." + status
      );
    },
  });
}

function listarProductos(items) {
  //almacena las ordenes
  orders = items;
  console.log("Ordenes");
  console.log(orders);

  let tabla = `<table class="table-responsive table-bordered border-primary text-nowrap">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Fecha</th>
                    <th>Estado</th>                    
                    <th>Productos</th>
                  </tr>`;

  //recorrer el arreglo de items de producto para pintarlos en la tabla
  for (let i = 0; i < orders.length; i++) {
    let orderDate = orders[i].registerDay;
    let ocurrence = orderDate.indexOf("T");
    orderDate = orderDate.substring(0, ocurrence);

    tabla += `<tr>
                <td>${orders[i].id}</td>
                <td>${orderDate}</td>
                <td>${orders[i].status}</td>`;
    
    //obtiene los productos de la orden
    products = orders[i].products;
    quantities = orders[i].quantities;

    let tablaProductos = `<table class="table-responsive table-bordered border-primary text-nowrap">
                <thead>
                  <tr>
                    <th>Referencia</th>
                    <th>Categoría</th>
                    <th>Marca</th>
                    <th>Descripcción</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                  </tr>`;

    let propiedades = Object.keys(products);
    let propiedadesCantidades = Object.keys(quantities);
    let objeto;
    let objetoCantidad;

    for (const property in products) {
        console.log(`${property}: ${products[property]}`);
        console.log(`${property}: ${quantities[property]}`);

        objeto = products[property];
        objetoCantidad = quantities[property];

        tablaProductos +=`<tr>
        <td>${objeto.reference}</td>
         <td>${objeto.category}</td>
         <td>${objeto.brand}</td>
         <td>${objeto.description}</td>
         <td>${objeto.price}</td>
         <td>${objetoCantidad}</td>
      </tr>`;  
    }

    //cierra tabla agregando el tag adecuado
    tablaProductos +=`</thead></table>`;

    tabla += `<td>${tablaProductos}</td>`;
    tabla += `</tr>`;
  }

  //cierra tabla agregando el tag adecuado
  tabla += `</thead></table>`;

  //accede al elemento con id 'listado' y adiciona la tabla de datos a su html
  $("#listado").html(tabla);
  $("#listado").show(1000);
}

//$(document).ready(function () {
//carga la librería javascript de jquery cuando se carga la página barcos.html por completo
//cuando carga la página html se ejecuta la función: listar()
$(document).ready(function () {
  //ejecuta función para enviar petición al ws
  estadoInicial();

  //si hizo clic en el enlace de cerrar sesion
  $("#cerrarSession").click(function () {
    sessionStorage.removeItem("user");
    location.href = "index.html";
  });

  $("#consultarOrden").click(function () {
    listar();
  });
});
