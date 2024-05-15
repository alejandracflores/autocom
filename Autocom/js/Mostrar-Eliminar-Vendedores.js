window.onload = init;

function init() {
    if(localStorage.getItem("token")) {
        loadUser();
    } else {
        window.location.href = "http://localhost:3000/tablavendedores";
    }
}

function loadUser() {
    axios({
        method: 'get',
        url: 'http://localhost:3000/user/byname',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem("token"),
        }
    }).then(function (res) {
        console.log(res);
        displayUser(res.data.message);
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', confirmDeletion);
        });
        document.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', function() {
                let id = button.dataset.id;
                window.location.href = 'http://localhost:3000/editarvendedor?id=' + id;
                console.log(id);
            });
        });
    }).catch(function (err) {
        console.log(err);
    });
}

function displayUser(users) {
    const detailsDiv = document.getElementById('employee-columns');
    detailsDiv.innerHTML = '';

    const filteredUsers = users.filter(user => user.Admin === 0);

    filteredUsers.forEach(user => {
        detailsDiv.innerHTML += `
            <tr>
                <td class="border px-4 py-2">${user.idEmpleado}</td>
                <td class="border px-4 py-2">${user.Nombre} ${user.Apellido}</td>
                <td class="border px-4 py-2 flex justify-center">
                    <div class="flex space-x-2">
                        <button class="btn-ventas bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded-md" data-id="${user.idEmpleado}">Ventas</button>
                        <button class="btn-edit bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded-md" data-id="${user.idEmpleado}">Editar</button>
                        <button class="btn-delete bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md" data-id="${user.idEmpleado}">Eliminar</button>
                    </div>
                </td>
            </tr>`;
    });
}

// Función de eliminar
function confirmDeletion(event) {
    if(confirm("¿Estás seguro de que quieres eliminarlo?")) {
        let id = event.target.dataset.id;
        deleted(id);
    }
}

function deleted(id) {
    axios({
        method: 'delete',
        url: 'http://localhost:3000/user/' + id,
        headers: {
            Authorization: 'Bearer '+ localStorage.getItem("token"),
        }
    }).then(function(res) {
        console.log(res);
        alert("El empleado fue eliminado correctamente");
        location.reload();
    }).catch(function(err){
        console.log(err);
        alert("Error al eliminar el empleado. Por favor, inténtalo de nuevo");
    });
}