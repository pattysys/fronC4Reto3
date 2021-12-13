/**
 * Este evento de JQuery se ejecuta cuando se termina de cargar la libreria
 */
$(document).ready(function () {
  estadoInicial();

    //si hizo clic en el enlace de cerrar sesion
    $("#cerrarSession").click(function (){
        sessionStorage.removeItem("user");
        location.href="index.html"
    });

});

/**
 * Estado inicial de la pagina, valida si el usuario se encuentra autenticado en la aplicaciòn
 */
function estadoInicial() {

  $("#opcionesAsesor").hide();
  $("#opcionesAdm").hide();
  $("#opcionesCoord").hide();
  let user = sessionStorage.getItem("user");

  if (user == null) location.href = "index.html";
  else {
    let userJS = JSON.parse(user);

    let typeUser;

    if (userJS.type=='ASE')
        typeUser="ASESOR";
    else if (userJS.type=='ADM')
        typeUser="ADMINISTRADOR";
    else if (userJS.type=='COORD')
        typeUser="COORDINADOR";




    //Valida el perfil para mostrar opciones sobre las que se tien acceso
    if (userJS.type == "ASE"){
      $("#opcionesAsesor").show();
      $("#opcionesAdm").hide();
      $("#opcionesCoord").hide();
    }else if (userJS.type == "ADM"){
      $("#opcionesAdm").show();
      $("#opcionesAsesor").hide();
      $("#opcionesCoord").hide();
    }else if (userJS.type == "COORD"){
      $("#opcionesCoord").show();
      $("#opcionesAsesor").hide();
      $("#opcionesAdm").hide();
    }  
    $("#userName").html(userJS.name);
    $("#userEmail").html(userJS.email);
    $("#userType").html(typeUser);
    $("#titulo").html("Bienvenido(a): " + userJS.name);
  }
}
