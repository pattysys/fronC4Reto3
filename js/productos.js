

function guardarInformacionProductos() {

    let formulario = $('#resultado1');
    
    let data = formulario.serializeArray();

    console.log(data);

    for (let index = 0; index < data.length; index++) {
        const element = data[index];

        if (!element.value) {
            alert(element.name + ' es obligatorio!');
            $('#' + element.name).focus();
            return;
        }
        
    }

    let var2 = {
        reference: $("#reference").val(),
        brand: $("#brand").val(),
        category: $("#category").val(),
        presentation: $("#presentation").val(),
        description:$("#description").val(),
        availability: $("#availability").val(),
        price:$("#price").val(),
        quantity:$("#quantity").val(),
        photography:$("#photography").val()
    };

    $.ajax({
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            data: JSON.stringify(var2),

            url: "http://localhost:8080/api/fragance/new",


            success: function (response) {
                console.log(response);
                console.log("Se guardo correctamente");
                alert("Producto creado de forma correcta");
                window.location.href="/listadoProductos.html"

            },

            error: function (jqXHR, textStatus, errorThrown) {
               // window.location.reload()
                alert("No fue posible crear producto");


            }
        }
    );
}

function actualizarInformacionProductos() {

    if (!$('#reference').val()) {
        alert('Debes ingresar una referencia');
        return;
    }
    var elemento = {
        reference: $("#reference").val(),
        brand: $("#brand").val(),
        category: $("#category").val(),
        presentation: $("#presentation").val(),
        description:$("#description").val(),
        availability: $("#availability").val(),
        price:$("#price").val(),
        quantity:$("#quantity").val(),
        photography:$("#photography").val()
        
    }

    var dataToSend = JSON.stringify(elemento);
    //JSON= JavaScript Object Notation
    $.ajax({
        type: "PUT",
        url: 'http://localhost:8080/api/fragance/update',
        dataType: "text",
        async: false,
        data: dataToSend,
        contentType: "application/json; charset=utf-8",

        success: function (response) {

            $("#miResultado").empty();
            $("#reference").val();
            $("#brand").val();
            $("#category").val();
            $("#presentation").val();
            $("#description").val();
            $("#availability").val();
            $("#price").val();
            $("#quantity").val();
            $("#photography").val();

            alert("Producto editado");
            window.location.href = "/listadoProductos.html"
        },

        error: function (jqXHR, textStatus, errorThrown) {

        }
    });

    disableCreate = (reference) => {
        return ($('#' + reference).val() != '') ? true : false;
    }

    disableUpdate = (reference) => {
        return ($('#' + reference).val() != '') ? false : true;
    }

}


function obtenerItemEspecificoProductos(referenceItem) {
    $.ajax({
        dataType: 'json',
        url: 'http://localhost:8080/api/fragance/' + referenceItem,
        type: 'GET',
        success: function (response) {
            console.log(response);



            var item = response;
            $("#reference").val(item.reference);
            $("#brand").val(item.brand);
            $("#category").val(item.category);
            $("#presentation").val(item.presentation);
            $("#description").val(item.description);
            $("#availability").val(item.availability);
            $("#price").val(item.price);
            $("#quantity").val(item.quantity);
            $("#photography").val(item.photography);
                       

            $("#buttonSave").attr('disabled', true);
            $("#buttonUpdate").attr('disabled', false);


        },

        error: function (jqXHR, textStatus, errorThrown) {

        }
    });

}


$(document).ready(
    () => {
        var url_string = window.location.href;
        var url = new URL(url_string);
        var productosReference = url.searchParams.get("productosReference");
        if (productosReference) {
            obtenerItemEspecificoProductos(productosReference);
        }
    }
);
