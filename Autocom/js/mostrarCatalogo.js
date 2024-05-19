window.onload = init;

function init() {
    Catalogo();
}

function Catalogo() {
    axios({
        method: 'get',
        url: 'http://localhost:3000/catalogo/',
    }).then(function (res) {
        console.log(res);
        displayCard(res.data.message);
    }).catch(function (err) {
        console.log(err);
    });
}

function displayCard(cards) {
    const detailsDiv = document.getElementById('card');
    detailsDiv.innerHTML = '';

    forEach(cards => {
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