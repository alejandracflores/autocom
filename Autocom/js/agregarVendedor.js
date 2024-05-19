window.onload = init;

function init() {
    if(localStorage.getItem("token")) {
        document.querySelector('.btn-secondary').addEventListener('click', function() {
            window.location.href = "tablaVendedores.html"
            });
    
        document.querySelector('.btn-primary').addEventListener('click', nuevoEmpleado);
    }
    else {
        window.location.href = "tablaVendedores.html";
    }
}

function nuevoEmpleado() {
    var idEmpleado = document.getElementById('id').value;
    var Nombre = document.getElementById('nombre').value;
    var Apellido = document.getElementById('apellidos').value;
    var Username = document.getElementById('nombreUsuario').value;
    var Contraseña = document.getElementById('contraseña').value;
    var rutaFoto = "../img/usuarios/" + idEmpleado + ".png"; 

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
        document.getElementById('id').value = '';
        document.getElementById('nombre').value = '';
        document.getElementById('apellidos').value = '';
        document.getElementById('nombreUsuario').value = '';
        document.getElementById('contraseña').value = '';
        alert("¡Usuario agregado!");
    }).catch(function(err){
        console.log(err);
    })
}
