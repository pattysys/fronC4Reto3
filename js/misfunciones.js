


function guardarInformacionUsuarios() {
    
    const identification = document.getElementById('identification');
    const name = document.getElementById('name');
    const address = document.getElementById('address');
    const cellPhone = document.getElementById('cellPhone');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const zone = document.getElementById('zone');
    const type = document.getElementById('type');
    
    
    if (identification.value.length == 0) {
      alert("Ingrese su identificacion")
      identification.focus()
      return 0;
    }
    
    if (name.value.length == 0) {
      alert("Ingrese su nombre")
      name.focus()
      return 0;
    
    }
    
    if (address.value.length == 0) {
        alert("Ingrese su direccion")
        address.focus()
        return 0;
    
    }
    
    if (cellPhone.value.length == 0) {
        alert("Ingrese un telefono")
        cellPhone.focus()
        return 0;
    
    }
    
    if (email.value.length == 0) {
        alert("Ingrese una email")
        email.focus()
        return 0;
    
    }
    
    if (password.value.length == 0) {
        alert("Ingrese una contraseña")
        password.focus()
        return 0;
    
    }
    
    if (zone.value.length == 0) {
        alert("Ingrese una zona")
        zone.focus()
        return 0;
    
    }
    
    if (type.value.length == 0) {
        alert("Ingrese una tipo de usuario")
        type.focus()
        return 0;
    
    }

    let var2 = {
        id: parseInt($("#identification").val()),
        identification: $("#identification").val(),
        name: $("#name").val(),
        address: $("#address").val(),
        cellPhone: $("#cellPhone").val(),
        email:$("#email").val(),
        password: $("#password").val(),
        zone:$("#zone").val(),
        type:$("#type").val()
    };

    $.ajax({
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: 'JSON',
            data: JSON.stringify(var2),

            url: "http://localhost:8080/api/user/new",


            success: function (response) {
                console.log(response);
                console.log("Se guardo correctamente");
                alert("Cuenta creada de forma correcta");
                window.location.href="/listadoUsers.html"

            },

            error: function (jqXHR, textStatus, errorThrown) {
                // window.location.reload()
                alert("No fue posible crear el usuario");


            }
        }
    );
}

function actualizarInformacionUsuarios() {

    if (!$('#id').val()) {
        alert('Debes ingresar una identificacion');
        return;
    }
    var elemento = {
        id: parseInt($("#identification").val()),
        identification: $("#identification").val(),
        name: $("#name").val(),
        address: $("#address").val(),
        cellPhone: $("#cellPhone").val(),
        email: $("#email").val(),
        password: $("#password").val(),
        zone: $("#zone").val(),
        type: $("#type").val()
        
    }

    var dataToSend = JSON.stringify(elemento);
    //JSON= JavaScript Object Notation
    $.ajax({
        type: "PUT",
        url: 'http://localhost:8080/api/user/update',
        dataType: "text",
        async: false,
        data: dataToSend,
        contentType: "application/json; charset=utf-8",

        success: function (response) {

            $("#miResultado").empty();
            $("#id").val();
            $("#identification").val();
            $("#name").val();
            $("#address").val();
            $("#cellPhone").val();
            $("#email").val();
            $("#password").val();
            $("#zone").val();
            $("#type").val();

            alert("Usuario editado");
            window.location.href = '\listadoUsers.html'
        },

        error: function (jqXHR, textStatus, errorThrown) {

        }
    });

    disableCreate = (id) => {
        return ($('#' + id).val() != '') ? true : false;
    }

    disableUpdate = (id) => {
        return ($('#' + id).val() != '') ? false : true;
    }

}


function obtenerItemEspecificoUsuarios(idItem) {
    $.ajax({
        dataType: 'json',
        url: 'http://localhost:8080/api/user/' + idItem,
        type: 'GET',
        success: function (response) {
            console.log(response);



            var item = response;
            $("#id").val(item.id);
            $("#identification").val(item.identification);
            $("#name").val(item.name);
            $("#address").val(item.address);
            $("#cellPhone").val(item.cellPhone);
            $("#email").val(item.email);
            $("#password").val(item.password);
            $("#zone").val(item.zone);
            $("#type").val(item.type);
            

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
        var userId = url.searchParams.get("userId");
        if (userId) {
            obtenerItemEspecificoUsuarios(userId);
        }
    }
);
