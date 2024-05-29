window.onload = init;

function init() {
    document.querySelector('.btn-primary').addEventListener('click', login);
}

function login() {
    var user = document.getElementById('username').value;
    var pass = document.getElementById('password').value;

    axios({
        method: 'post',
        url: 'http://localhost:3000/user/login',
        data: {
            Username: user,
            Contraseña: pass
        }
    }).then(function(res) {
        if(res.data.code === 200) {
            localStorage.setItem("token", res.data.message);
            localStorage.setItem("isAdmin", res.data.isAdmin);
            localStorage.setItem("id", res.data.id);
            localStorage.setItem("fotoPerfil", res.data.fotoPerfil);
            if (res.data.isAdmin === 1) {
                window.location.href = "http://localhost:3000/tablavendedores";
            } else {
                window.location.href = "http://localhost:3000/catalogo";
            }
        }
        else {
            alert("Usuario y/o contraseña incorrectos");
        }
    }).catch(function(err){
        console.log(err);
    })
}