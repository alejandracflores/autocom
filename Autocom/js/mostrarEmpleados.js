window.onload = init;

function init() {
    if(localStorage.getItem("token")) {
        loadUser();
    }
    else {
        window.location.href = "tablaVendedores.html";
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
                        <button class="btn-delete bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded-md ">Editar</button>
                        <button class="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md">Eliminar</button>
                    </div>
                </td>
            </tr>`;
    });
}
