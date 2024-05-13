window.onload = init;

function init() {
    if(localStorage.getItem("token")) {
        document.querySelector('.btn-secondary').addEventListener('click', function() {
            window.location.href = "index-admin.html"
            });
    
        document.querySelector('.btn-primary').addEventListener('click', nuevoEmpleado);
    }
    else {
        window.location.href = "index.admin.html";
    }
}

function nuevoEmpleado() {
    var idEmpleado = document.getElementById('input-id').value;
    var Nombre = document.getElementById('input-Nombre').value;
    var Apellido = document.getElementById('input-Apellido').value;
    var Username = document.getElementById('input-Username').value;
    var Contraseña = document.getElementById('input-Contraseña').value;
    var rutaFoto = localStorage.getItem(idEmpleado + ".png")

    axios({
        method: 'post',
        url: 'http://localhost:3000/user/nuevoEmpleado',
        data: {
            idEmpleado: idEmpleado,
            Nombre: Nombre,
            Apellido: Apellido,
            Username: Username,
            Contraseña: Contraseña,
            Foto: rutaFoto
        }
    }).then(function(res) {
        console.log(res);
    }).catch(function(err){
        console.log(err);
    })
}