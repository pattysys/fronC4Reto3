let userZona;
let orders = [];
let salesman = {};
let oderId;

/**
 * Establece el aspecto inicial de la interfaz
 */
function estadoInicial() {
    $("#alerta").hide();
    $("#detalleOrden").hide();
    $("#procesarOrden").hide();
    $("#pedido").html("");
    $("#listado").hide();

    let user = sessionStorage.getItem("user");

    if (user == null) location.href = "index.html";
    else {
        let userJS = JSON.parse(user);
        userZona = userJS.zone;
        let typeUser;

        if (userJS.type == "COORD") typeUser = "COORDINADOR";
        else location.href = "index.html";

        $("#nameUser").html(userJS.name);
        $("#emailUser").html(userJS.email);
        $("#typeUser").html(typeUser);
    }
    listar();
}

/**
 * Invoca servicio Web que se encarga de recuperar las ordenes x zona (corresponde a las ordenes de los vendendores cuya zona coincide con la del coordinador)
 */
function listar() {
    $.ajax({
        // la URL para la petición (url: "url al recurso o endpoint")
        url: `http://localhost:8080/api/order/zona/${userZona}`,

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

/**
 * Crea una tabla html con la información de las ordenes asociadas a la zona
 * @param {*} items elementos retornados por el ws
 */
function listarProductos(items) {
    //almacena las ordenes
    orders = items;
    console.log("Ordenes");
    console.log(orders);

    let tabla = `<table class="table-responsive table-bordered border-primary text-nowrap">
                <thead>
                  <tr>
                    <th>Identificación</th>
                    <th>Nombres</th>
                    <th>Email</th>
                    <th>Fecha</th>
                    <th>Id</th>
                    <th>Estado</th>                    
                    <th>Ver detalle</th>
                  </tr>`;

    //recorrer el arreglo de items de producto para pintarlos en la tabla
    for (let i = 0; i < orders.length; i++) {
        let orderDate = orders[i].registerDay;
        let ocurrence = orderDate.indexOf("T");
        orderDate = orderDate.substring(0, ocurrence);
        salesMan = orders[i].salesMan;

        tabla += `<tr>
                <td>${salesMan.identification}</td>
                <td>${salesMan.name}</td>
                <td>${salesMan.email}</td>
                <td>${orderDate}</td>
                <td>${orders[i].id}</td>
                <td>${orders[i].status}</td>
                <td><button class="btn btn-outline-primary" id="ped_${orders[i].id}" onclick="detalleOrden(${i})">Ver pedido</button></</td>
            </tr>`;
    }

    //cierra tabla agregando el tag adecuado
    tabla += `</thead></table>`;

    //accede al elemento con id 'listado' y adiciona la tabla de datos a su html
    $("#listado").html(tabla);
    $("#listado").show(1000);
}

/**
 * Detalla la orden de pedido, según el indice o posición en el arreglo de ordenes asociadas a la zona comercial
 * @param {*} indice correspnde al indice del arreglo de ordenes en el que se encuentra la orden a detallar
 */
function detalleOrden(indice) {
    let order = orders[indice];
    let products = [];
    let quantities = [];
    let objeto;
    let objetoCantidad;

    oderId = order.id;

    $("#listado").hide(500);

    //recupero los productos y cantidades de producto en la orden
    products = order.products;
    quantities = order.quantities;

    //construyo tabla de encabezado
    let tabla = `<table class="table-responsive table-bordered border-primary text-nowrap">
                <thead>
                <tr>
                    <th>Identificación</th>
                    <th>Nombres</th>
                    <th>Email</th>
                    <th>Fecha</th>
                    <th>Id</th>
                    <th>Estado</th>                                        
                </tr>`;

    
        let orderDate = order.registerDay;
        let ocurrence = orderDate.indexOf("T");
        orderDate = orderDate.substring(0, ocurrence);
        salesMan = order.salesMan;

        tabla += `<tr>
                    <td>${salesMan.identification}</td>
                    <td>${salesMan.name}</td>
                    <td>${salesMan.email}</td>
                    <td>${orderDate}</td>
                    <td>${order.id}</td>
                    <td>${order.status}</td>
                  </tr>`;
    

    //cierra tabla agregando el tag adecuado
    tabla += `</thead></table>`;


    //construyo la tabla de productos
    let tablaProductos = tabla + `<table class="table-responsive table-bordered border-primary text-nowrap mt-5">
                <thead>
                  <tr>
                    <th>Referencia</th>
                    <th>Categoría</th>
                    <th>Marca</th>
                    <th>Descripcción</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                  </tr>`;

    for (let property in products) {
        objeto = products[property];
        objetoCantidad = quantities[property];

        tablaProductos += `<tr>
        <td>${objeto.reference}</td>
         <td>${objeto.category}</td>
         <td>${objeto.brand}</td>
         <td>${objeto.description}</td>
         <td>${objeto.price}</td>
         <td>${objetoCantidad}</td>
      </tr>`;
    }

    //cierra tabla agregando el tag adecuado
    tablaProductos += `</thead></table>`;

    //accede al elemento con id 'listado' y adiciona la tabla de datos a su html
    $("#orden").html(tablaProductos);
    $("#detalleOrden").show(1000);
}

/**
 * Invoca a WS para actaulziar el estado de la orden
 */
function actualizarEstadoOrden(){
    let estadoOrden = $("#estadoOrden").val();

    //crea un objeto javascript
    let datos = {
        id: oderId,
        status: estadoOrden
    }

    //convierte el objeto javascript a json antes de agregarlo a los datos de la petición
    let datosPeticion = JSON.stringify(datos);

    $.ajax({
        // la URL para la petición (url: "url al recurso o endpoint")
        url: `http://localhost:8080/api/order/update`,

        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        //si el metodo del servicio recibe datos, es necesario definir el parametro adicional
        data: datosPeticion,

        // especifica el tipo de petición http: POST, GET, PUT, DELETE
        type: 'PUT',

        contentType: "application/JSON",

        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (respuesta) {
            //recibe el arreglo 'items' de la respuesta a la petición
            console.log(respuesta);
            estadoInicial()
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

    //si hizo clic en el enlace de cerrar sesion
    $("#cancelarDetalle").click(function () {
        $("#detalleOrden").hide(1000);
        $("#listado").show(1000);
    });

    //si hizo clic en el enlace de cerrar sesion
    $("#actualizarOrden").click(function () {
        actualizarEstadoOrden();
    });
});
