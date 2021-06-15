//service-worker
if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw.js')
    .then(reg =>console.log('registro de service worker exitoso', reg))
    .catch(err=>console.warn('error al tratar de registorar el service worker',err))
}

//coneccion a base de datos
firebase.initializeApp({
    apiKey: 'AIzaSyC7UxIs9HhLvmElxe75LWfMTG98VUVqkF4',
    authDomain: 'dolar-5562d.firebaseapp.com',
    projectId: 'dolar-5562d'
  });

var db = firebase.firestore();
 
//leer todos los documentos que tenemos en la base de datos
var tabla = document.getElementById('tabla');

//TENER ACTUALIZADO EL DOLAR POR DIA
fetch('https://www.dolarsi.com/api/api.php?type=valoresprincipales')
.then(function(response) {
  return response.json();
})
.then(function(myJson) {
    var dolar = myJson;
    console.log(dolar)
    var valuedolar = parseInt(dolar[1].casa.compra);
    console.log(valuedolar);
    document.getElementById('DOLAR').innerHTML= valuedolar + " USD";
})

//obtiene los datos de de todos los documentos 
db.collection("Telefonos").onSnapshot((querySnapshot) => {
    tabla.innerHTML = '';
    querySnapshot.forEach((doc) => {
        tabla.innerHTML +=`<tr>
        <td>${doc.data().Nombre}</td>
        <td>${doc.data().Precio} USD</td>
        <td>${doc.data().Cantidad}<button class="btn btn-primary btn-sm ml-1 mr-1" onclick="up('${doc.id}')">+</button><button class="btn btn-warning btn-sm" onclick="low('${doc.id}')">-</button></td>
        <td><button class="btn btn-success" onclick = calculate('${doc.id}')>Calcular</button></td>
    </tr>`
    });
});

//agregar elementos a la tabla
function add() {
        let nombre = document.getElementById('Nombre').value;
        let cantidad = document.getElementById('Cantidad').value;
        let precio = document.getElementById('Precio').value;
        db.collection("Telefonos").add({
        Cantidad: cantidad,
        Nombre:nombre,
        Precio:precio
        })
        .then(function (docRef) {
            alert("TELEFONO AGREGADO CORRECTAMENTE")
            document.getElementById('Nombre').value = '';
            document.getElementById('Cantidad').value = '';
            document.getElementById('Precio').value = '';
        })
        .catch(function(error){
            alert('Error al agregar elemento', error)
        })
};

//calcular el precio segun el dolar
function calculate(id) {
    fetch('https://www.dolarsi.com/api/api.php?type=valoresprincipales')
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
    var precioRef = db.collection("Telefonos").doc(id);
    precioRef.get().then(function(doc) {
    if (doc.exists) {
        var valorprecio = parseInt((doc.data().Precio))
        console.log(valorprecio);
        var dolar = myJson;
        console.log(dolar)
        var valuedolar = parseInt(dolar[1].casa.compra);
        console.log(valuedolar)
        alert("$"+valorprecio*valuedolar)
    } else {
        console.log("ERROR");
    }
    }).catch(function(error) {
    console.log("Error getting document:", error);
    });
    });     
}
//subir la cantidad de el objeto de la tabla seleccionado
function up(id) {
    var cantidadRef = db.collection("Telefonos").doc(id);

    cantidadRef.get().then(function(doc) {
        if (doc.exists) {
            var cantidadorg = parseInt(doc.data().Cantidad)
            var cantidadfin = cantidadorg + 1;
            cantidadRef.update({
                Cantidad:cantidadfin
            })
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

//bajar la cantidad de el objeto de la tabla seleccionado
function low(id) {
        var cantidadRef = db.collection("Telefonos").doc(id);
    
        cantidadRef.get().then(function(doc) {
            if (doc.exists) {
                var cantidadorg = parseInt(doc.data().Cantidad)
                var cantidadfin = cantidadorg - 1;
                cantidadRef.update({
                    Cantidad:cantidadfin
                })
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        })
}