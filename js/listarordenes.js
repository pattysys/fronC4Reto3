//almacena la totalidad de los productos
let productos = [];
//almacena solamente los productos seleccionados
let productosSeleccionados = [];
//almacena la cantidad seleccionada x cada producto
let cantidades = [];

/**
 * Establece el aspecto inicial de la interfaz
 */
function estadoInicial(){
    let user = sessionStorage.getItem("user");

    if (user== null)
        location.href="index.html";
    else{
        let userJS = JSON.parse(user);
        let typeUser;

        if (userJS.type=='ASE')
            typeUser="ASESOR";
        else if (userJS.type=='ADM')
            typeUser="ADMINISTRADOR";
        else if (userJS.type=='COORD')
            typeUser="COORDINADOR";

        $("#nameUser").html(userJS.name);
        $("#emailUser").html(userJS.email);
        $("#typeUser").html(typeUser);
    }

    $("#listado").show(500);    
}

/**
 * Esta función ejecuta la petición asincrona tipo GET al API REST
 */
function listar() {
    $.ajax({
        // la URL para la petición (url: "url al recurso o endpoint")
        url: "http://localhost:8080/api/fragance/all",
        
        // especifica el tipo de petición http: POST, GET, PUT, DELETE
        type: 'GET',

        // el tipo de información que se espera de respuesta
        dataType: 'json',

        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success: function (respuesta) {
            //recibe el arreglo 'items' de la respuesta a la petición
            listarProductos(respuesta);
        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error: function (xhr, status) {
            $("#alerta").html("Ocurrio un problema al ejecutar la petición..." + status);
        },

        // código a ejecutar sin importar si la petición falló o no
        complete: function (xhr, status) {
            $("#alerta").html("Obteniendo listado productos...");
            $("#alerta").hide(1000);
        }
    });
}

/* 
    Esta función se encarga de recorrer el listado de datos 'items' recibido como parametro,
    construir una tabla html en la variable javascript 'tabla',
    acceder al elemento elemento identificado con el id 'listado'
    y modificar su html agregando el contenido de la variable 'tabla'.
    
*/
function listarProductos(items){
    $("#listado").html("");
    $("#listado").show(500);

    productos = items;

    let tabla = `<table class="table table-bordered border-primary">
                <thead>
                  <tr>
                    <th>Referencia</th>
                    <th>Categoría</th>
                    <th>Marca</th>
                    <th>Presentacion</th>
                    <th>Precio</th>
                    <th colspan="2">Acciones</th>
                  </tr>`;
    
    //recorrer el arreglo de items de producto para pintarlos en la tabla
    for (let index = 0; index < items.length; index++) {

        let texto = `<strong>Referencia:</strong> ${items[index].reference}</br><strong>Descripción:</strong> ${items[index].description}`;
        
        let availability = items[index].availability ? 'SI':'NO';
        tabla +=`<tr>
                  <td>${items[index].reference}</td>
                   <td>${items[index].category}</td>
                   <td>${items[index].brand}</td>
                   <td>${items[index].presentation}</td>
                   <td>${items[index].price}</td>
                   <td><input type="number" id="prod_${items[index].reference}"/></td>
                   <td><button id="bot_${items[index].reference}" onclick="registrarproducto('${index}')">Agregar</button></td>
                    </td>
                   </tr>`;     
    }

    //cierra tabla agregando el tag adecuado
    tabla +=`</thead></table>`;

    //accede al elemento con id 'listado' y adiciona la tabla de datos a su html
    $("#listado").html(tabla);

}

/**
 * Se ejecuta al hacer clic sobre el boton agregar, y se encarga de adicionar productos y cantidades a los 
 * respectivos arreglos
 * @param {*} indice posición del elemento en el arreglo de productos (productos[])
 */
 function registrarproducto(indice){
    //Obtengo la referencia del producto
    let referencia = productos[indice].reference;

    //el ide de la caja de datos esta formado por la palabra prod + _ + la referencia del producto
    let idCaja= `prod_${referencia}`;
    //se utilizan para valdiar si el producto fue previamente adicionado al arreglo de productos seleccionados
    let index=0;
    let encontro=false;
    //convierte en entero el dato que se ingresa en la caja de texto
    cantidadProducto = parseInt(document.getElementById(idCaja).value);

    //Valido si previamente existe el producto en el arreglo de cantidades, obtiene la cantidad previa y suma la nueva cantidad
    for (index = 0; index < productosSeleccionados.length; index++) {
        if (productosSeleccionados[index].reference ==referencia){
            encontro=true;
            break;
        }
    }

    //si encontro el producto entre los seleccionados, suma la cantidad solicitada a la cantidad de producto
    //o agrega el producto y la cantidad solicitada a los respectivos arreglos
    if (encontro){
        cantidades[index] = cantidades[index] + cantidadProducto;
    }else{
        cantidades.push(cantidadProducto);
        productosSeleccionados.push(productos[indice]);
    }
    
    //limpio cantidad de producto y asigno el cursor sobre el campo
    document.getElementById(idCaja).value="";
    document.getElementById(idCaja).focus();
    
    pintarPedido();
}

/**
 * Crea una tabla hmtl con los productos seleccionado y sus cantidades
 */
function pintarPedido(){
    
    let tabla= document.querySelector("#pedido");
    let subtotal = 0;
    tabla.innerHTML="";
    for (let indice = 0; indice < productosSeleccionados.length; indice++) {
          
              let tr = document.createElement("tr")
              let tdReference = document.createElement("td")
              let tdPrice = document.createElement("td")
              let tdCantidad = document.createElement("td")
              let tdsubTotal = document.createElement("td")
              let precio = parseInt(productosSeleccionados[indice].price);
              let cantidad = parseInt(cantidades[indice]);
              
  
              tdReference.innerHTML = productosSeleccionados[indice].reference;
              tdPrice.innerHTML =  productosSeleccionados[indice].price;
              tdCantidad.innerHTML = cantidades[indice]
              tdsubTotal.innerHTML = (precio * cantidad);

              tr.appendChild(tdReference);
              tr.appendChild(tdPrice);
              tr.appendChild(tdCantidad);
              tr.appendChild(tdsubTotal);
              tabla.appendChild(tr);
              
              subtotal = subtotal + precio * cantidad;
      }
      tr = document.createElement("tr");
      let tdsubTotal = document.createElement("td")
      let tdTitulo = document.createElement("td")
      tdsubTotal.innerHTML=subtotal;
      tdTitulo.innerHTML="Total";
      tr.appendChild(tdTitulo);
      tr.appendChild(document.createElement("td"));
      tr.appendChild(document.createElement("td"));
      tr.appendChild(tdsubTotal);
      tabla.appendChild(tr);
  }
//$(document).ready(function () {
//carga la librería javascript de jquery cuando se carga la página barcos.html por completo
//cuando carga la página html se ejecuta la función: listar()
$(document).ready(function () {
    //configura el aspecto inicial de la pagina
    estadoInicial();
    //ejecuta función para enviar petición al ws
    listar();

    //si hizo clic en el enlace de cerrar sesion
    $("#cerrarSession").click(function (){
        sessionStorage.removeItem("user");
        location.href="index.html"
    });
});

