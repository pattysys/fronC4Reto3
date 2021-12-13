function traerInformacionUsuarios() {
    $.ajax({
        url: "http://localhost:8080/api/user/all",
        type: "GET",
        datatype: "JSON",
        success: function (respuesta) {
            console.log(respuesta);
            pintarRespuesta(respuesta);
        }
    });
}

function pintarRespuesta(respuesta) {
    let myTable = "<table class=\"table\">";
    for(i=0;i <respuesta.length;i++){
        myTable += "<tr>"
            myTable+="<td>"+respuesta[i].identification+"</td>";
            myTable+="<td>"+respuesta[i].name+"</td>";
            myTable+="<td>"+respuesta[i].address+"</td>";
            myTable+="<td>"+respuesta[i].cellPhone+"</td>";
            myTable+="<td>"+respuesta[i].email+"</td>";
            myTable+="<td>"+respuesta[i].password+"</td>";
            myTable+="<td>"+respuesta[i].zone+"</td>";
            myTable+="<td>"+respuesta[i].type+"</td>";
            myTable+="<td> <button class=\"btn btn-success\"onclick='redirect("+respuesta[i].id+")'>Editar</button>";
            myTable+="<td> <button class=\"btn btn-danger\" onclick='borrarInformacionUsuarios("+respuesta[i].id+")'> Eliminar</button>";
    
            myTable += "</tr>";
    }

    myTable+= "</table>";
    $("#listaUser").html(myTable);


}

redirect = (userId) => {
    window.location.href = '/userForm.html?userId=' + userId;
};

$(document).ready(
    () => {
        traerInformacionUsuarios();
    }
);

function borrarInformacionUsuarios(idElemento) {

    //JSON= JavaScript Object Notation
    $.ajax({
        dataType: 'json',
        url: 'http://localhost:8080/api/user/' + idElemento,
        type: 'DELETE',
        contentType: 'application/json',

        success: function (response) {
            console.log(response);
            alert("Usuario Borrado de la BD");
            window.location.reload()
        },

        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
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

createUser = () => {
    window.location.href = '/userForm.html';
};

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
            window.location.reload()
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


