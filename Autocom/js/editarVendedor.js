window.onload = init;

function init() {
    if(localStorage.getItem("token")) {
        let id = obtenerIdEmpleadoParaEditar();
        console.log(id);
        obtenerDatosEmpleado(id);
        
        document.querySelector('.btn-cancel').addEventListener('click', function() {
            window.location.href = "http://localhost:3000/tablavendedores";
        });

        document.querySelector('.btn-send').addEventListener('click', function() {
            confirmEditing();
        });
    }
    else {
        window.location.href = "http://localhost:3000/";
    }
}

function obtenerIdEmpleadoParaEditar() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    console.log(id);
    return id;
}


function obtenerDatosEmpleado(id) {
    axios({
        method: 'get',
        url: 'http://localhost:3000/user/' + id,
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem("token"),
        }
    }).then(function (res) {
        console.log('Server response:', res.data);
        const data = res.data.message[0]; // Acceder a los datos correctos
        document.getElementById('edit-input-id').value = data.idEmpleado;
        document.getElementById('edit-input-name').value = data.Nombre;
        document.getElementById('edit-input-lastname').value = data.Apellido;
        document.getElementById('edit-input-username').value = data.Username;
        document.getElementById('edit-input-contraseña').value = data.Contraseña;
    })    
    .catch(function (err) {
        console.log(err);
        alert("Error al obtener los datos del empleado. Por favor, inténtalo de nuevo");
    });
}

// Función para confirmar la edición
function confirmEditing() {
    let id = obtenerIdEmpleadoParaEditar(); // Obtener el ID cuando se confirme la edición
    if(confirm("¿Estás seguro de que quieres editar?")) {
        edit(id);
    }
}

// Función para editar los datos
function edit(id) {
    var idEmpleado = parseInt(document.getElementById('edit-input-id').value);
    var Nombre = document.getElementById('edit-input-name').value;
    var Apellido = document.getElementById('edit-input-lastname').value;
    var Username = document.getElementById('edit-input-username').value;
    var Contraseña = document.getElementById('edit-input-contraseña').value;
    var rutaFoto = "../images/usuarios/" + idEmpleado + ".png";

    axios({
        method: 'put',
        url: 'http://localhost:3000/user/' + id,
        data: {
            idEmpleado: idEmpleado,
            Nombre: Nombre,
            Apellido: Apellido,
            Username: Username,
            Contraseña: Contraseña,
            Foto: rutaFoto,
        },
        headers: {
            Authorization: 'Bearer '+ localStorage.getItem("token"),
        }
        
    }).then(function(res) {
        console.log(res);
        alert("El empleado fue editado correctamente");
    }).catch(function(err){
        console.log(err);
        alert("Error al editar el empleado. Por favor, inténtalo de nuevo");
    })
}
