document.addEventListener('DOMContentLoaded', function() {

window.onload = init;

function init() {
    if(localStorage.getItem("token")) {
        const id = localStorage.getItem('id');
        console.log(id);
        obtenerDatosEmpleado(id);
    } else {
        window.location.href = "http://localhost:3000/";
    }
}

document.getElementById('logout').addEventListener('click', function() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    window.location.href = "http://localhost:3000/";
});

function obtenerDatosEmpleado(id) {
    axios({
        method: 'get',
        url: 'http://localhost:3000/user/' + id,
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem("token"),
        }
    }).then(function (res) {
        const data = res.data.message[0];
        console.log(data);
        console.log(data.idEmpleado);
        document.getElementById('id-perfil').innerText = data.idEmpleado;
        document.getElementById('nombre-perfil').innerText = data.Nombre;
        document.getElementById('apellido-perfil').innerText = data.Apellido;
        document.getElementById('username-perfil').innerText = data.Username;
    }).catch(function (err) {
        console.log(err);
        alert("Error al obtener los datos de la cuenta. Por favor, inténtalo de nuevo");
    });
}
});