////////////INDICE//////////////
//~~~1.LOGIN Y LOGOUT
//-hacerLogin
//-cerrarSesion
//-focusLogin
//-comprobarLogin
//~~~2.REGISTRO
//-registrarse
//-goLogin
//-comprobarLog
//-comprobarPass
//~~~3.INDEX
//-pedirUltimasRecetasPaginadas
//-previouspage
//-nextpage
//-lastpage
//-fastSearch
//~~~4.RECETA
//-cargarReceta
//-cargarFotos
//-cargarIngredientes
//-cargarComentarios
//-votar
//-comentar
//~~~5.BUSCAR
//-comprobarParamsBus
//-buscarReceta
//-mostrarResultadosBusqueda
//-previouspageBus
//-nextpageBus
//-lastpageBus
//~~~6.NUEVA RECETA
//-subirReceta
//-anadirZonaFoto
//-mostrarFoto
//-subirFotos
//-goIndex
//-anadirIngrediente
//-subirIngredientes
//~~~FUNCIONES UTILES
//-goTo
//-crearMensaje

///            ///             ///              ///            ///            ///             ///              ///
///1.LOGIN Y LOGOUT//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///            ///             ///              ///            ///            ///             ///              ///
///-------------LOGIN--------------------------------------------
function hacerLogin(frm) {
    let xhr = new XMLHttpRequest(),
        url = './rest/login/',
        fd = new FormData(frm);

    xhr.open('POST', url, true);
    xhr.onload = function() {
        console.log(xhr.responseText);
        let usu = JSON.parse(xhr.responseText);
        if (usu.RESULTADO == "OK") { //si el login devuelve OK guardamos datos en local
            sessionStorage.setItem('login', usu.login);
            sessionStorage.setItem('clave', usu.clave);
            sessionStorage.setItem('nombre', usu.nombre);
            sessionStorage.setItem('email', usu.email);

            console.log('Usuario:' + sessionStorage.login);
            console.log('Clave:' + sessionStorage.clave);
            goTo("index");
        }
        crearMensaje(usu);
    };
    xhr.send(fd);
    // goTo("index");
    return false; //para que la funcion devuelva false y se termine la accion lo del retun del html
}
///--------------LOGOUT--------------------------------------------
function cerrarSesion() {
    sessionStorage.clear();
    goTo("index");
    return false;
}

///----------DEVOLVER EL FOCUS AL LOGIN--------------------------------------------
function focusLogin() {
    document.getElementById('usuario').focus(); //volvemos a hacer focus en el form
}
///-------------COMPROBAR LOGUIN--------------------------------------------
function comprobarLogin() {
    let nav = document.getElementById('menu'),
        html = '';

    if (sessionStorage.getItem("login")) { // si se tienen datos del usuario en sessionStorage
        html += '<ul>';
        html += '<li><label for="ckb-menu">&equiv;</label></li>';
        html +=
            '<li><a href="index.html"><span class="icon-home"></span>Inicio</a></li>';
        html +=
            '<li><a href="buscar.html"><span class="icon-search"></span>Buscar</a></li>';
        html +=
            '<li><a href="nueva_receta.html"><span class="icon-upload-cloud"></span>Nueva receta</a></li>';
        html +=
            '<li><a href="logout.html"><span class="icon-logout"></span>Logout</a></li>';
        html += '</ul>';
        //aqui compruebo si esta en loguin logueado y lo mando a index
        var url = window.location.href;
        var lastPart = url.substr(url.lastIndexOf('/') + 1);
        if (lastPart === "login.html" || lastPart === "registro.html") {
            goTo("index");
        }
    } else {

        html += '<ul>';
        html += '<li><label for="ckb-menu">&equiv;</label></li>';
        html +=
            '<li><a href="index.html"><span class="icon-home"></span>Inicio</a></li>';
        html +=
            '<li><a href="buscar.html"><span class="icon-search"></span>Buscar</a></li>';
        html +=
            '<li><a href="login.html"><span class="icon-login"></span>Login</a></li>';
        html +=
            '<li><a href="registro.html"><span class="icon-users"></span>Registro</a></li>';
        html += '</ul>';
        var url = window.location.href;
        var lastPart = url.substr(url.lastIndexOf('/') + 1);
        if (lastPart === "nueva_receta.html") {
            goTo("index");
        }
    }
    nav.innerHTML = html;
    return false;
}


///            ///             ///              ///            ///            ///             ///              ///
///2.REGISTRO//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///            ///             ///              ///            ///            ///             ///              ///
///--------------REGISTRARSE--------------------------------------------
function registrarse(frm) {
    let xhr = new XMLHttpRequest(),
        url = './rest/usuario/',
        fd = new FormData(frm);
    fd.append('login', frm.login.value);
    fd.append('pwd', frm.pwd.value);
    fd.append('pwd2', frm.pwd2.value);
    fd.append('nombre', frm.nombre.value);
    fd.append('email', frm.email.value);
    fd.append('fnac', frm.fnac.value);
    xhr.open('POST', url, true);
    xhr.send(fd);
    xhr.onload = function() {
            var res = JSON.parse(xhr.responseText);
            if (res.RESULTADO == 'OK') {
                document.getElementById("formRegistro").reset(); //limpiamos form
                crearMensaje('regOk'); //creamos mensaje que al cerrar lleva a login
            }
        }
        // return false;
}
//--------------ir a login al cerrar mensaje registro ok--------------------------------------------
function goLogin() {
    goTo("login");
}
//--------COMPROBAR LOGIN DISPONIBLE--------------------------------------------
function comprobarLog() {
    let login = '' + document.getElementById("login").value;
    //ahora llamamos a la base
    let xhr = new XMLHttpRequest(),
        url = './rest/login/' + login;
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onload = function() {
            let res = JSON.parse(xhr.responseText);
            if (res.DISPONIBLE == true) {
                document.getElementById("comlog").classList.remove('rojo');
                document.getElementById("comlog").classList.add('verde');
                document.getElementById("comlog").innerHTML =
                    "Usuario disponible";
            }
            if (res.DISPONIBLE == false) {
                document.getElementById("comlog").classList.remove('verde');
                document.getElementById("comlog").classList.add('rojo');
                document.getElementById("comlog").innerHTML =
                    "Usuario no disponible";
            }
        }
        // return false; //para que la funcion devuelva false y se termine la accion
}
///-------Comprobar contraseñas coinciden--------------------------------------------
function comprobarPass() {
    let pwd = '' + document.getElementById("pwd").value;
    let pwd2 = '' + document.getElementById("pwd2").value;
    if (pwd == pwd2) {
        //si las contraseñas coinciden el boton de registro deja de estar disabled
        document.getElementById("botonRegistro").removeAttribute('disabled');
        document.getElementById("compass").classList.remove('rojo');
        document.getElementById("compass").classList.add('verde');
        document.getElementById("compass").innerHTML =
            "Contrase&ntilde;as coinciden";
    } else {
        //si las contraseñas no coinciden  el boton esta disabled y aparece un mensaje
        document.getElementById("botonRegistro").setAttribute('disabled',
            'disabled');
        document.getElementById("compass").classList.remove('verde');
        document.getElementById("compass").classList.add('rojo');
        document.getElementById("compass").innerHTML =
            "Contrase&ntilde;as no coinciden";
    }
}
///            ///             ///              ///            ///            ///             ///              ///
///3.INDEX//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///            ///             ///              ///            ///            ///             ///              ///
///-------Pedir las ultimas recetas paginadas--------------------------------------------
function pedirUltimasRecetasPaginadas(x, y) {
    let xhr = new XMLHttpRequest(),
        url = './rest/receta/?pag=' + x + '&lpag=' + y, //para paginar en index
        section = document.getElementById("recetas"); // para afectar al section el padre del padre
    // url += '?pag='+ frm.pag.value + '&lpag=' + frm.lpag.value;// para concatenar cadenas igual que en java

    xhr.open('GET', url, true);
    xhr.onload = function() {
            let recetas = JSON.parse(xhr.responseText);
            if (recetas.RESULTADO == 'OK') {
                section.innerHTML = ''; //borro todo lo de dentro de section
                let html = '';
                //COMO SE CONCATENA LAS RECETAS
                for (let i = 0; i < recetas.FILAS.length; i++) {
                    let fila = recetas.FILAS[i],
                        foto = 'http://localhost/pcw/practica02/fotos/' + fila.fichero;
                    html += '<article>';
                    html += '<figure>';
                    html += '<img src="' + foto + '" alt="' + fila.descripcion_foto +
                        '" width="100%" height="400" >';
                    html += '<figcaption>Foto: ' + fila.descripcion_foto +
                        '<br>Elaboracion: <br>' + fila.elaboracion + '</figcaption>';
                    html += '<footer><a href="receta.html?id=' + fila.id +
                        '">Ver más</a></footer>';
                    html += '</figure>';
                    html += '<a href="receta.html?id=' + fila.id + '"><h1>' + fila.nombre +
                        '</h1></a>';
                    html += '<span>Dificultad: ' + fila.dificultad;
                    html += ', Comensales: ' + fila.comensales;
                    html += ', Tiempo: ' + fila.tiempo + ' min.</span>';
                    html += '<footer>';
                    html += '<a href="buscar.html?autor=' + fila.autor + '">Autor: ' +
                        fila.autor +
                        '</a><br>';
                    html += 'Fecha: <time datetime="' + fila.fecha + '">' + fila.fecha +
                        '</time><br>';
                    html += '<span>Votos +(' + fila.positivos + ')</span> <br>';
                    html += '<span>Votos -(' + fila.negativos + ')</span> <br>';
                    html += '<span>Numero de imágenes: ' + fila.nfotos + '</span> <br>';
                    html += '<span>Comentarios(' + fila.comentarios + ')</span>';
                    html += '</footer>';
                    html += '</article>';
                } //for
                let totalPaginas = Math.ceil(recetas.TOTAL_COINCIDENCIAS / recetas.REGISTROS_POR_PAGINA);
                let pagina = x + 1;
                html += '<footer class="pagination" style="text-align:center;">';
                html +=
                    '<button onclick="pedirUltimasRecetasPaginadas(0, 6);"><<</button>';
                if (x > 0) { //solo añadimos pagina anterior cuando no estamos en la 0
                    html += '<button onclick="previouspage(' + x + ')"><</button>';
                }
                if (pagina != totalPaginas) { //pagina siguiente cuando no estamos en la ultima
                    html += '<button onclick="nextpage(' + x + ')">></button>';
                }
                html += '<button onclick="lastpage(' + totalPaginas + ')">>></button>';
                html += '<p> P&aacute;gina ' + pagina + ' de ' + totalPaginas +
                    '</p>';
                html += '</footer>';
                section.innerHTML = html; //meto todo el codigo html en la seccion
            } //if
        } //xhr.onload
    xhr.send();
}
///-------Funciones para la paginacion de las ultimas recetas--------------------------------------------
function previouspage(x) {
    x--;
    pedirUltimasRecetasPaginadas(x, 6);
    return false;
}

function nextpage(x) {
    x++;
    pedirUltimasRecetasPaginadas(x, 6);
    return false;
}

function lastpage(totalPaginas) {
    let x = totalPaginas - 1;
    pedirUltimasRecetasPaginadas(x, 6);
    return false;
}
///-------Busqueda rapida--------------------------------------------
function fastSearch(frm) {
    //si se busca algo vamos a busqueda y pasamos ese texto como parametro
    if (frm.texto.value != "") {
        window.location.replace("./buscar.html?texto=" + frm.texto.value);
    }
}
///            ///             ///              ///            ///            ///             ///              ///
///4.RECETA//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///            ///             ///              ///            ///            ///             ///              ///
///------------Cargar la receta
function cargarReceta() {
    var usuario = "";
    let r = window.location.search;
    let varsurl = r.split("&");
    if (varsurl[0].indexOf("id") >= 0) {
        let idreceta = varsurl[0].split("=")[1];
        let xhr = new XMLHttpRequest();
        let url = './rest/receta/' + idreceta;
        xhr.open('GET', url, true);
        xhr.send();
        xhr.onload = function() {
            let v = JSON.parse(xhr.responseText);
            console.log(v);
            if (v.RESULTADO == 'OK') {
                let receta = v.FILAS[0];
                //si intenta acceder a una receta que no existe lo mando a index.html
                if (receta == undefined) {
                    goTo("index");
                }
                let html = '';
                html += '  <h1 style="text-align:center">' + receta.nombre + '</h1>';
                html +=
                    '<div style="	display: flex;flex-wrap: wrap;justify-content: center;" id="fotos"></div>';
                html += ' <h3 style="text-align:center">Ingredientes:</h3><br>';
                html += '<div id="ingredientes"></div>';
                html += ' <h3 style="text-align:center">Elaboracion:</h3><br>';
                html += '<p>' + receta.elaboracion + '</p>'
                html += '<a href="buscar.html?autor=' + receta.autor + '">Autor: ' +
                    receta.autor + '</a> <br>';
                html += '<span>Tiempo de Elaboración: ' + receta.tiempo +
                    ' min</span><br>';
                html += '<span>Dificultad: ' + receta.dificultad + '</span><br>';
                html += '<span>Número de comensales: ' + receta.comensales +
                    '</span><br>';
                html += 'Fecha: <time datetime="' + receta.fecha + '">' + receta.fecha +
                    '</time> <br>';
                // html += ' <span>Votos Totales = (' + (receta.positivos - receta.negativos) +
                //   ')</span> <br>';
                html += ' <span>Votos +(' + receta.positivos + ')</span> <br>';
                html += ' <span>Votos -(' + receta.negativos + ')</span> <br>';

                html += '<span>Dificultad: ' + receta.dificultad + '</span><br>';
                html += '<a id="linkToComents" href="receta.html?id=' + receta.id +
                    '#comentarios">Comentarios (' + receta.comentarios + ')</a>';
                html += '</footer>';
                if (sessionStorage.getItem("login")) {
                    html += '<div style="text-align: center">';
                    html += '<button onclick="votar(' + receta.id +
                        ',1);">Me gusta :)</button>';
                    html += '<button onclick="votar(' + receta.id +
                        ',0);">No me gusta :(</button>';
                    html += '</div>';
                }


                document.getElementById("receta").innerHTML = html;
                cargarFotos(receta.id);
                cargarIngredientes(receta.id);
                cargarComentarios(receta.id);
            }
        }
    } else {
        window.location.replace("http://localhost/practica02");
    }
}
///---------cargar las fotos de la receta
function cargarFotos(rid) {
    let xhr = new XMLHttpRequest();
    let url = 'rest/receta/' + rid + '/fotos';
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onload = function() {
        let v = JSON.parse(xhr.responseText);
        if (v.RESULTADO == 'OK') {
            let html = '';
            for (let i = 0; i < v.FILAS.length; i++) {
                let foto = v.FILAS[i];
                html += '<figure style="width:50%">';
                html += '<img class="noOpacity" src="fotos/' + foto.fichero +
                    '" alt=""  height="500,auto" width="90%">';
                html += ' <h4>Foto</h4>';
                html += '<p>' + foto.texto + '</p>';
                html += '</figure>';
            }
            document.getElementById("fotos").innerHTML += html;
        }
    }
}
///---------cargar los ingredientes de la receta
function cargarIngredientes(rid) {
    let xhr = new XMLHttpRequest();
    let url = 'rest/receta/' + rid + '/ingredientes';
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onload = function() {
        let v = JSON.parse(xhr.responseText);
        if (v.RESULTADO == 'OK') {
            let html = '';
            html += '<p>';
            for (let i = 0; i < v.FILAS.length; i++) {
                let ingrediente = v.FILAS[i];
                html += ingrediente.nombre + ', ';
            }
            html += '</p>';
            document.getElementById("ingredientes").innerHTML += html;
        }
    }
}
///---------cargar los comentarios de la receta
function cargarComentarios(rid) {
    let xhr = new XMLHttpRequest();
    let url = 'rest/receta/' + rid + '/comentarios';
    xhr.open('GET', url, true);
    xhr.send();
    let html = '';
    html += '<h2 >Comentarios</h2><hr>';
    //si hay login pueden comentar, si no les sale que se logueen
    if (sessionStorage.getItem("login")) {
        //llamamos al form del formComentario.html y lo pintamos
        let xhr = new XMLHttpRequest();
        let urlCom = 'formComentario.html';
        xhr.open('GET', urlCom, true);
        xhr.send();
        xhr.onload = function() {
            html += xhr.responseText;
        }

    } else {
        html +=
            '<p >Para dejar un comentario debes estar <a href="login.html">logueado</a></p><br>';
    };
    xhr.onload = function() {
        let v = JSON.parse(xhr.responseText);
        console.log(v);
        if (v.RESULTADO == 'OK') {
            for (let i = 0; i < v.FILAS.length; i++) {
                let comentario = v.FILAS[i];
                html += '<hr>';
                html += '<div class="comentario">';
                html += '<h3>' + comentario.titulo + '</h3>';
                html += '<h4>' + comentario.autor + '</h4>';
                html += '<time datetime="' + comentario.fecha + '">' + comentario.fecha +
                    '</time>';
                html += '<p>' + comentario.texto + '</p>';
                html += '</div>';
            }
            html += '</aside>';
            document.getElementById("comentarios").innerHTML = html;
        }
    }
}
///--------comentar la receta
function comentar(frm) {
    console.log(frm);
    if (sessionStorage.getItem("login") && sessionStorage.getItem("clave")) {
        console.log("logueado y con clave");
        let idRec = document.getElementById("linkToComents").href.split("?id=")[1].split(
            "#")[0];
        let xhr = new XMLHttpRequest(),
            url = './rest/receta/' + idRec + '/comentario';
        console.log(url);
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Authorization', sessionStorage.getItem("clave"));
        let fd = new FormData();
        fd.append("l", sessionStorage.getItem("login"));
        fd.append("titulo", frm.titulo_comentario.value);
        fd.append("texto", frm.texto_comentario.value);
        xhr.send(fd);
        xhr.onload = function() {
            let res = JSON.parse(xhr.responseText);
            if (res.RESULTADO == 'OK') {
                document.getElementById("comentar").reset();
                crearMensaje("comentarioSubido");
            } else {
                crearMensaje("comentarioSubidoError");
            }
        }
    }
}
///----------DEVOLVER EL FOCUS AL form del comentario--------------------------------------------
//volvemos a hacer focus en el texto del form porque cuando lo devolvia al form no se notaba
function focusFormCom() {
    document.getElementById('texto_comentario').focus();
}
///--------votar la receta
function votar(rid, voto) {
    let xhr = new XMLHttpRequest(),
        url = './rest/receta/' + rid + '/voto/' + voto;
    var login = sessionStorage.getItem("login");
    let args = "l=" + login;
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Authorization', sessionStorage.getItem("clave"));
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
        let res = JSON.parse(xhr.responseText);
        console.log(res);
        if (res.VOTO == 'POSITIVO') {
            crearMensaje("positivo")
        }
        if (res.VOTO == 'NEGATIVO') {
            crearMensaje("negativo")
        }
    }
    xhr.send(args);
    return false;
}

///            ///             ///              ///            ///            ///             ///              ///
///5.BUSCAR//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///            ///             ///              ///            ///            ///             ///              ///
///--------comprobar los parametros que llegan a buscar
function comprobarParamsBus() {
    let r = window.location.search;
    console.log(r);
    let varsurl = r.split("&");
    console.log(varsurl);

    if (varsurl[0] != "") { //si hay parametros
        let parametro = varsurl[0].split("?")[1];
        console.log(parametro);
        if (parametro.startsWith("autor")) {
            //si nos llega un autor lo mete en su input y realiza la busqueda y muestra los resultados
            let autor = parametro.split("=")[1];
            document.getElementById("autor").value = autor;
            document.getElementById("buscar").click();
        }
        if (parametro.startsWith("texto")) {
            //si nos llega algo desde la busqueda rapida de index
            let texto = parametro.split("=")[1];
            let url = './rest/receta/?t=' + texto;
            urlsearch = url;
            let xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.send();
            xhr.onload = function() {
                let v = JSON.parse(xhr.responseText);
                console.log(v);
                let totalpaginasSearch = Math.floor(v.FILAS.length / 6);
                console.log(totalpaginasSearch);
                if (v.FILAS.length % 6 != 0) {
                    totalpaginasSearch++;
                }
                mostrarResultadosBusqueda(0, 6);
            }
            return false;
        }
    } else {
        //si no llegan parametros muestro las ultimas paginadas
        pedirUltimasRecetasPaginadas(0, 6);

    }
}
///--------buscar una receta
function buscarReceta(frm) {
    //primero borro todas las ultimas recetas en caso de que no
    //hubieran venido parametros y las haya mostrado
    document.getElementById("ultimas").innerHTML = '';
    document.getElementById("recetas").innerHTML = '';

    let url = './rest/receta/';
    let aux = false;

    //nombre
    if (frm.titulo.value != '') {
        if (aux == false) {
            url += '?n=' + frm.titulo.value;
            aux = true;
        } else {
            url += '&n=' + frm.titulo.value;
        }
    }
    //ingredientes
    if (frm.ingredientes.value != '') {
        if (aux == false) {
            url += '?i=' + frm.ingredientes.value;
            aux = true;
        } else {
            url += '&i=' + frm.ingredientes.value;
        }
    }
    //tiempo de elaboracion / duracion
    if (frm.tiempo1.value != '') {
        if (aux == false) {
            url += '?di=' + frm.tiempo1.value;
            aux = true;
        } else {
            url += '&di=' + frm.tiempo1.value;
        }
    }
    if (frm.tiempo2.value != '') {
        if (aux == false) {
            url += '?df=' + frm.tiempo2.value;
            aux = true;
        } else {
            url += '&df=' + frm.tiempo2.value;
        }
    }
    //dificultad
    if (frm.dificultad.value != '') {
        if (aux == false) {
            url += '?d=' + frm.dificultad.value;
            aux = true;
        } else {
            url += '&d=' + frm.dificultad.value;
        }
    }
    //numero de comensales
    if (frm.numComensales.value != '') {
        if (aux == false) {
            url += '?c=' + frm.numComensales.value;
            aux = true;
        } else {
            url += '&c=' + frm.numComensales.value;
        }
    }
    //autor
    if (frm.autor.value != '') {
        if (aux == false) {
            url += '?a=' + frm.autor.value;
            aux = true;
        } else {
            url += '&a=' + frm.autor.value;
        }
    }
    urlsearch = url;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onload = function() {
        let v = JSON.parse(xhr.responseText);
        console.log(v);
        let totalpaginasSearch = Math.floor(v.FILAS.length / 6);
        console.log(totalpaginasSearch);
        if (v.FILAS.length % 6 != 0) {
            totalpaginasSearch++;
        }
        mostrarResultadosBusqueda(0, 6);
    }
    return false;
}
//mostrar resultados busqueda
function mostrarResultadosBusqueda(x, y) {
    let url = urlsearch;
    console.log(url);
    let xhr = new XMLHttpRequest();
    url += '&pag=' + x + '&lpag=' + y;
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onload = function() {
        let recetas = JSON.parse(xhr.responseText);
        document.getElementById("imprimirbusqueda").innerHTML = ''; //borro todo lo de dentro de resultados
        console.log(recetas);
        let html =
            '<div><h2 style="text-align:center;">' + recetas.TOTAL_COINCIDENCIAS +
            ' Resultados:</h2></div><br>';
        //COMO SE CONCATENA LAS RECETAS
        for (let i = 0; i < recetas.FILAS.length; i++) {
            let fila = recetas.FILAS[i],
                foto = 'http://localhost/pcw/practica02/fotos/' + fila.fichero;
            html += '<article>';
            html += '<figure>';
            html += '<img src="' + foto + '" alt="' + fila.descripcion_foto +
                '" width="100%" height="400">';
            html += '<figcaption>Foto: ' + fila.descripcion_foto +
                '<br>Elaboracion: <br>' + fila.elaboracion + '</figcaption>';
            html += '<footer><a href="receta.html?id=' + fila.id +
                '">Ver más</a></footer>';
            html += '</figure>';
            html += '<a href="receta.html?id=' + fila.id + '"><h1>' + fila.nombre +
                '</h1></a>';
            html += '<span>Dificultad: ' + fila.dificultad;
            html += ', Comensales: ' + fila.comensales;
            html += ', Tiempo: ' + fila.tiempo + ' min.</span>';
            html += '<footer>';
            html += '<a href="buscar.html?autor=' + fila.autor + '">Autor: ' +
                fila.autor +
                '</a><br>';
            html += 'Fecha: <time datetime="' + fila.fecha + '">' + fila.fecha +
                '</time><br>';
            html += '<span>Votos +(' + fila.positivos + ')</span> <br>';
            html += '<span>Votos -(' + fila.negativos + ')</span> <br>';
            html += '<span>Numero de imágenes: ' + fila.nfotos + '</span> <br>';
            html += '<span>Comentarios(' + fila.comentarios + ')</span>';
            html += '</footer>';
            html += '</article>';
        } //for
        let totalPaginas = Math.ceil(recetas.TOTAL_COINCIDENCIAS / recetas.REGISTROS_POR_PAGINA);
        let pagina = x + 1;
        html += '<footer class="pagination" style="text-align:center;">';
        // iba a quitar la paginacion en caso de que solo hubiera una pagina
        // hubiera sido poner el if asi if (totalPaginas > 1) {
        // pero alomejor me la corrigen y se piensan que no la he implementado
        // asi que solo restringo el avanzar pagina y retroceder en caso de que
        // sea solo 1 pagina.
        if (totalPaginas != 0) {
            html +=
                '<button onclick="mostrarResultadosBusqueda(0, 6);"><<</button>';
            if (x > 0) { //solo añadimos pagina anterior cuando no estamos en la 0
                html += '<button onclick="previouspageBus(' + x + ')"><</button>';
            }
            if (pagina != totalPaginas) { //pagina siguiente cuando no estamos en la ultima
                html += '<button onclick="nextpageBus(' + x + ')">></button>';
            }
            html += '<button onclick="lastpageBus(' + totalPaginas +
                ')">>></button>';
            html += '<p> P&aacute;gina ' + pagina + ' de ' + totalPaginas +
                '</p>';
        }
        html += '</footer>';
        document.getElementById("imprimirbusqueda").innerHTML = html; //meto todo el codigo html en la seccion
    }
    return false;
}
///-------Funciones para la paginacion de los resultados de busqueda-------------------------------------------
function previouspageBus(x) {
    x--;
    mostrarResultadosBusqueda(x, 6);
    return false;
}

function nextpageBus(x) {
    x++;
    mostrarResultadosBusqueda(x, 6);
    return false;
}

function lastpageBus(totalPaginas) {
    let x = totalPaginas - 1;
    mostrarResultadosBusqueda(x, 6);
    return false;
}

///            ///             ///              ///            ///            ///             ///              ///
///6.NUEVA RECETA//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///            ///             ///              ///            ///            ///             ///              ///
///-------------Subir la receta--------------------------------------------
function subirReceta(frm) {
    let xhr = new XMLHttpRequest();
    let url = './rest/receta/';
    let fd = new FormData();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Authorization', sessionStorage.getItem("clave"));
    fd.append("l", sessionStorage.getItem("login"));
    fd.append("n", frm.titulo.value);
    fd.append("e", frm.elaboracion.value);
    fd.append("t", frm.tiempo.value);
    fd.append("d", frm.dificultad.value);
    fd.append("c", frm.comensales.value);
    //si al menos hay una foto en la receta
    var fotos = document.querySelectorAll(".foto");
    if (fotos.length < 1) {
        crearMensaje("minimo1foto");
    } else {
        //enviamos los datos basicos de la receta sin ingredientes ni fotos para crear el id
        xhr.onload = function() {
            console.log(xhr.responseText);
            let v = JSON.parse(xhr.responseText);
            console.log(v);
            if (v.RESULTADO == 'OK') {
                console.log("se ha creado el id de la receta" + v.ID);
                let idReceta = v.ID;
                //ahora recogemos los ingredientes
                subirIngredientes(idReceta);
                //ahora recogemos las fotos
                subirFotos(idReceta);
            } else {
                descripcionError = v.DESCRIPCION;
                crearMensaje("errorNuevaReceta");
            }
        }
        xhr.send(fd);
        // return false;
    }

}
///--------------añadir una zona para subir una foto
function anadirZonaFoto() {
    var fotos = document.getElementById("fotos");
    if (fotos.childNodes.length < 2) {


        let html = '';
        html += '<div class="foto" id="foto">'
        html +=
            '<label for="subirfoto"><img  onclick="this.parentNode.parentNode.childNodes[4].click();" src="imgs/noimg.jpg"  width="200" height="200" ></label><br>';
        html +=
            '<textarea placeholder="Descripci&oacute;n de la foto"></textarea><br >';
        html +=
            '<input onchange="mostrarFoto(this);" type="file" name="file" class="file" accept="image/x-png,image/gif,image/jpeg" required><br id="preInput">';
        html +=
            '<button  onclick="this.parentNode.remove();">Eliminar foto</button><br><hr>';
        html += '</div>'
        document.getElementById("fotos").innerHTML += html;

    } else {
        var foto = document.getElementById("foto");
        fotoNueva = document.importNode(foto, true);
        fotos.appendChild(fotoNueva);
        //lo de aqui abajo es para que al añadir nueva foto, esta este vacia
        fotoNueva.childNodes[0].childNodes[0].src = "imgs/noimg.jpg";
        fotoNueva.childNodes[2].value = '';
        fotoNueva.childNodes[4].remove();

        var newNode = document.createElement("input");
        newNode.type = "file";
        newNode.name = "file";
        newNode.className = "file";
        newNode.accept = "image/x-png,image/gif,image/jpeg"
        newNode.setAttribute("onchange", "mostrarFoto(this)");

        preInput = fotoNueva.childNodes[4];
        fotoNueva.insertBefore(newNode, preInput);
    }

}
///-------------------mostrar la foto que sube
function mostrarFoto(btn) {

    var newNode = document.createElement("input");
    newNode.type = "file";
    newNode.name = "file";
    newNode.className = "file";
    newNode.accept = "image/x-png,image/gif,image/jpeg"
    newNode.setAttribute("onchange", "mostrarFoto(this)");

    let foto = btn.parentNode;

    let inp = btn.parentNode.childNodes[4];
    //si la imagen es mas grande que 300kb no lo carga
    if (inp.files[0].size > 300000) {
        //si la imagen es mas grande se crea el mensaje y ademas se vacia la imagen el texto y el input del archivo
        crearMensaje("imgGrande");
        inp.remove();
        preInput = document.getElementById("preInput");
        foto.insertBefore(newNode, preInput);
        let img = foto.childNodes[0].childNodes[0];
        img.src = "imgs/noimg.jpg";
        let text = foto.childNodes[2];
        text.value = '';
    } else {
        fr = new FileReader(btn);
        fr.onload = function() {
            let img = btn.parentNode.childNodes[0].childNodes[0];
            img.src = fr.result;
            img.alt = inp.files[0].name;
        };
        fr.readAsDataURL(inp.files[0]);
    }
}
///-------------------subir las fotos
function subirFotos(idReceta) {
    var login = sessionStorage.getItem("login");
    var fotos = document.querySelectorAll(".foto");
    let url = './rest/receta/' + idReceta + '/foto';
    console.log(fotos.length);
    //ahora compruebo que al menos hay una fotos

    for (let foto of fotos) {
        let xhr = new XMLHttpRequest();
        let fd = new FormData();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Authorization', sessionStorage.getItem("clave"));
        fd.append("l", login);
        fd.append("f", foto.querySelector("input.file").files[0]);
        fd.append("t", foto.querySelector("textarea").value);
        xhr.onload = function() {
            let v = JSON.parse(xhr.responseText);
            console.log(v);
            if (v.RESULTADO == 'OK') {
                let idFoto = v.ID;

            } else {
                // paramos la funcion si ha habido un error con alguna de ellas
                // y enviamos un mensaje del error
                crearMensaje("errorSubirFoto");
                return false;
            }
        }
        xhr.send(fd);
        // return false;
    } //for
    //aqui se han acabado de subir todas las fotos asi que aqui limpiamos el form
    // y lanzamos el mensaje con el titulo de receta creada
    let titulo = document.getElementById("titulo").value;

    let capa_fondo = document.createElement('div'),
        capa_frente = document.createElement('div'),
        html = '';
    capa_fondo.appendChild(capa_frente);
    html +=
        '<h2 ">Receta creada</h2>';
    html +=
        '<p> Se ha creado correctamente la receta <b>' + titulo + '</b></p>';
    html +=
        '<button id="boton" onclick="this.parentNode.parentNode.remove();goIndex();">Cerrar</button>';

    capa_frente.innerHTML = html;
    capa_fondo.classList.add('capa-fondo');
    capa_frente.classList.add('capa-frente');
    document.body.appendChild(capa_fondo);
    document.getElementById('boton').focus();

    //ahora borramos el form
    document.getElementById("fotos").remove();
    document.getElementById("formNuevaReceta").reset();
    //y redirigimos a index en el mensaje



}
///-----------------Ir a index despues de crearla Bien
function goIndex() {
    goTo("index");
}


///----------------Añadir ingrediente a la lista editable
function anadirIngrediente() {
    let nuevoIng = document.getElementById("nuevoIng").value;
    let ingredientes = document.getElementById("ingredientes");
    if (nuevoIng != "") { //si nuevo ingrediente no esta vacio
        let html = '<li>' + nuevoIng + '</li>';
        ingredientes.innerHTML += html;
        document.getElementById("nuevoIng").value = '';
        document.getElementById("nuevoIng").focus();
    }
}

function subirIngredientes(idReceta) {
    let xhr = new XMLHttpRequest();
    let url = './rest/receta/' + idReceta + '/ingredientes';
    var login = sessionStorage.getItem("login");
    let ingredientes = document.getElementById("ingredientes").innerHTML;
    if (ingredientes != "") { //si hay ingredientes

        let paso1 = ingredientes.split("<li>");
        let arrayIng = [];
        for (let r = 1; r < paso1.length; r++) {
            let ingrediente = paso1[r].split("</li>")[0];

        }
        let i = JSON.stringify(arrayIng);
        let args = "l=" + login + "&i=" + i;
        console.log(args);
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Authorization', sessionStorage.getItem("clave"));
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onload = function() {
            let res = JSON.parse(xhr.responseText);
            console.log(res);
            if (res.RESULTADO != "OK") {
                crearMensaje("errorNuevosIng");
            }
        }
        xhr.send(args);
        return false;
    }


}
///            ///             ///              ///            ///            ///             ///              ///
///UTILES//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///            ///             ///              ///            ///            ///             ///              ///
///-------------REDIRECCIONAMIENTO--------------------------------------------
function goTo(page) {
    location.href = "./" + page + ".html";
    return false;
}

///-------------MENSAJE--------------------------------------------
function crearMensaje(aux) {
    let capa_fondo = document.createElement('div'),
        capa_frente = document.createElement('div'),
        html = '';

    capa_fondo.appendChild(capa_frente);

    //comentario subido correctamente
    if (aux == 'comentarioSubido') {
        html +=
            '<h2>Comentario subido correctamente</h2>';
        html +=
            '<p> El comentario se ha guardado correctamente, por favor refresque la pagina para visualizarlo </p>';
        html +=
            '<button id="boton" onclick="this.parentNode.parentNode.remove();">Cerrar</button>';
    }
    //error subir comentario
    if (aux == 'comentarioSubidoError') {
        html +=
            '<h2 style="background-color: #FF1616">Error al subir el comentario</h2>';
        html +=
            '<p> Ha habido un error al subir el comentario, intentalo de nuevo </p>';
        html +=
            '<button id="boton" onclick="this.parentNode.parentNode.remove();focusFormCom();">Cerrar</button>';
    }

    //imagen mayor de 300kb
    if (aux == 'imgGrande') {
        html +=
            '<h2 style="background-color: #FF1616">Error al subir la foto</h2>';
        html +=
            '<p> la imagen es demasiado grande, por favor selecciona otra </p>';
        html +=
            '<button id="boton" onclick="this.parentNode.parentNode.remove();">Cerrar</button>';
    }
    //minimo una foto subir receta
    if (aux == 'minimo1foto') {
        html +=
            '<h2 style="background-color: #FF1616">Error al subir la receta</h2>';
        html +=
            '<p> Al menos debes añadir una foto </p>';
        html +=
            '<button id="boton" onclick="this.parentNode.parentNode.remove();">Cerrar</button>';
    }
    //error al subir alguna foto
    if (aux == 'errorSubirFoto') {
        html +=
            '<h2 style="background-color: #FF1616">Error al subir la foto de la receta</h2>';
        html +=
            '<p> Ha habido un error subiendo una de las fotos de la receta </p>';
        html +=
            '<button id="boton" onclick="this.parentNode.parentNode.remove();">Cerrar</button>';
    }

    //error al crear la receta
    if (aux == 'errorNuevaReceta') {
        html +=
            '<h2 style="background-color: #FF1616">Error al crear la receta</h2>';
        html += '<p> ' + descripcionError + ' </p>';
        html +=
            '<button id="boton" onclick="this.parentNode.parentNode.remove();">Cerrar</button>';
    }
    //error al añadir los ingredientes
    if (aux == 'errorNuevosIng') {
        html +=
            '<h2 style="background-color: #FF1616">Error al añadir los ingredientes</h2>';
        html += '<p> ha habido un error al subir los ingredientes </p>';
        html +=
            '<button id="boton" onclick="this.parentNode.parentNode.remove();">Cerrar</button>';
    }

    //voto positivo en receta
    if (aux == 'positivo') {
        html += '<h2>Voto positivo realizado</h2>';
        html += '<p>El voto (+) ha sido un exito !! </p>';
        html +=
            '<button id="boton" onclick="this.parentNode.parentNode.remove();">Cerrar</button>';
    }
    //voto negativo en receta
    if (aux == 'negativo') {
        html += '<h2>Voto negativo realizado</h2>';
        html += '<p>El voto (-) ha sido un exito !! </p>';
        html +=
            '<button id="boton" onclick="this.parentNode.parentNode.remove();">Cerrar</button>';
    }
    // registro correcto
    if (aux == 'regOk') {
        html += '<h2>Registro correcto</h2>';
        html += '<p>El registro ha sido un exito !! </p>';
        html +=
            '<button id="boton" onclick="this.parentNode.parentNode.remove();goLogin();">Cerrar</button>';
    }
    //login correcto (no lo pide, solo pide que redirija a index)
    // if (aux.RESULTADO == "OK") {
    //   html += '<h2>Login correcto</h2>';
    //   html += '<p>Bienvenido ' + aux.login + ' !! </p>';
    //   html +=
    //     '<button id="boton" onclick="this.parentNode.parentNode.remove();">Cerrar</button>';
    // }
    //login incorrecto
    if (aux.RESULTADO == "ERROR") {
        html += '<h2 style="background-color: #FF1616">Login incorrecto</h2>';
        html += '<p>No se ha podido realizar el Login. Intentelo de nuevo</p>';
        html +=
            '<button id="boton" onclick="this.parentNode.parentNode.remove();focusLogin();">Cerrar</button>';
    }
    //le añadimos el html a la capa del mensaje
    capa_frente.innerHTML = html;
    capa_fondo.classList.add('capa-fondo'); // le ponemos clase para darle estilo luego
    capa_frente.classList.add('capa-frente');
    document.body.appendChild(capa_fondo); // le ponemos al body la capa de fondo como hijo
    document.getElementById('boton').focus();

}