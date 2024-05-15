window.onload = init;

function init() {
    if(localStorage.getItem("token")) {
        document.querySelector('.btn-delete').addEventListener('click', confirmDeletion);
    }
    else {
        window.location.href = "tallernode.html";
    }
}

function confirmDeletion() {
    if(confirm("¿Estás seguro de que quieres eliminarlo?")) {
        deleted();
    }
}

function deleted() {
    let id = document.getElementById('delete-input').value;

    axios({
        method: 'delete',
        url: 'http://localhost:3000/employee/' + id,
        headers: {
            Authorization: 'Bearer '+ localStorage.getItem("token"),
        }
    }).then(function(res) {
        console.log(res);
        alert("El empleado fue eliminado correctamente");
    }).catch(function(err){
        console.log(err);
        alert("Error al eliminar el empleado. Por favor, inténtalo de nuevo");
    });
}