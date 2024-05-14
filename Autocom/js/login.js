window.onload = init;

function init() {
    if(localStorage.getItem("token")) {
        document.querySelector('.btn-primary').addEventListener('click', login);
    }
    else {
        window.location.href = "reservaP1.html";
    }
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
            if (res.data.isAdmin === 1) {
                window.location.href = "index-admin.html";
            } else {
                window.location.href = "index-vendedor.html";
            }
        }
        else {
            alert("Usuario y/o contraseña incorrectos");
        }
    }).catch(function(err){
        console.log(err);
    })
}