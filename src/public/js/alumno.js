 // Initialize Firebase
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


//Datos 
const codigo = document.getElementById('codigo_universitario');
const nombre = document.getElementById('nombres_alumno');
const apellidos = document.getElementById('apellidos_alumno');
const curso = document.getElementById('curso');
const btnRegistrar = document.getElementById('registrar');
const alert = document.getElementById('alert');

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


alert.style.display= 'none';
btnRegistrar.addEventListener('click', e=>{
  e.preventDefault();
  if(codigo.value && nombre.value && apellidos.value && curso.value){
    let alumno = {
      codigo:codigo.value,
      nombre:nombre.value,
      apellidos:apellidos.value,
      curso:curso.value
    }
    db.ref('alumnos').push(alumno,err=>{
      if(err){
        mostrarMensaje('err','Ocurrió un error al guardar');
      }else{
        mostrarMensaje('success','Alumno registrado');
        codigo.value = '';
        nombre.value = '';
        apellidos.value = '';
        curso.value = '';
      }
    });
  }else{
    mostrarMensaje('err','Los datos deben estar completos');
  }
});
