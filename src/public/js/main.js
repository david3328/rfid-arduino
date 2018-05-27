var config = {
  apiKey: "AIzaSyBJ6_7cKvHmZyuOnj5vr2lr4AIG8wwjZaw",
  authDomain: "rfid-arduino.firebaseapp.com",
  databaseURL: "https://rfid-arduino.firebaseio.com",
  projectId: "rfid-arduino",
  storageBucket: "rfid-arduino.appspot.com",
  messagingSenderId: "887710525160"
};
firebase.initializeApp(config);

const db = firebase.database();


const socket = io();
let alumno;
const formRegistrar = document.getElementById('registrar');
const btnConnect = document.getElementById('connect');
const btnWrite = document.getElementById('write');
const imgArduino = document.getElementById('imgArduino');
const alert = document.getElementById('alert');
const search = document.getElementById('searchCodigo');
const codigo = document.getElementById('codigo');
const dataAlumno = document.getElementById('alumno');

//Funciones
function mostrarMensaje(tipo,mensaje){
  alert.innerHTML = mensaje;
  if(tipo==='err'){
    alert.classList.add('alert-danger');
  }else{
    alert.classList.add('alert-success');    
  }
  alert.style.display='block';
  setTimeout(function(){ 
    alert.classList.remove('alert-success');
    alert.classList.remove('alert-danger');    
    alert.style.display = 'none';
  }, 1000);  
}

formRegistrar.style.display = 'none';
alert.style.display = 'none';
btnWrite.disabled = true;

btnConnect.addEventListener('click', e => {
  e.preventDefault();
  socket.emit('connect:arduino');
})

//Escuchar socket
socket.on('connect:success',()=>{
  btnConnect.style.display = 'none';
  imgArduino.style.display = 'none';
  formRegistrar.style.display = 'block';
  //redireccionar a otra vista 
});

socket.on('write:success',()=>{
  mostrarMensaje('success','Código y Usuario Registrado'); 
  dataAlumno.value = 'Esperando...';
  codigo.value='';
  btnWrite.disabled = true;
})

search.addEventListener('click',e=>{
  e.preventDefault();
  db.ref('alumnos').once('value').then(snapshot=>{
    const alumnos = Object.values(snapshot.val());
    alumnos.forEach(el =>{
      if(el.codigo.toLowerCase() == codigo.value.toLowerCase()){
        alumno = el;
        dataAlumno.value = `${alumno.nombre} ${alumno.apellidos}`;
        btnWrite.disabled = false;
        return;
      }
    })
    if(alumno==null)
      mostrarMensaje('err','Código no encontrado'); 
  })
})

btnWrite.addEventListener('click',e=>{
  e.preventDefault();
  socket.emit('write:arduino',`${alumno.codigo}-${alumno.apellidos}`);
  // console.log();
})
// socket.on('arduino:data',data=>{
//   msg.innerHTML = 'Nombre: '+data.nombre;
// })
