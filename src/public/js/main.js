const formRegistrar = document.getElementById('registrar');
const btnConnect = document.getElementById('connect');
const btnWrite = document.getElementById('write');
const imgArduino = document.getElementById('imgArduino');
const alert = document.getElementById('alert');
const search = document.getElementById('searchCodigo');
const codigo = document.getElementById('codigo');
const dataAlumno = document.getElementById('alumno');
// const miAlumno = document.getElementById('mi_alumno');
// const nombreAlumno = document.getElementById('nombre_alumno');
// const imgAlumno = document.getElementById('img_alumno');

//Funciones
let alumno;
const socket = io();

//Inicializar componentes
formRegistrar.style.display = 'none';
alert.style.display = 'none';
btnWrite.disabled = true;
// miAlumno.style.display = 'none';

btnConnect.addEventListener('click', e => {
  e.preventDefault();
  socket.emit('connect:arduino');
})



// socket.on('read:code',(data)=>{
//   miAlumno.style.display = 'block';
//   console.log(data);
//   if(data===null || data===undefined || data===''){
//     nombreAlumno.innerHTML = 'Alumno no encontrado';
//     imgAlumno.src = '';
//   }
//   db.ref('alumnos').once('value').then(snapshot=>{
//     const alumnos = Object.values(snapshot.val());
//     alumnos.forEach(el =>{
//       if(el.codigo.toLowerCase() == data.toLowerCase()){
//         alumno = el;
//         nombreAlumno.innerHTML = `${alumno.nombre} ${alumno.apellidos}`;
//         imgAlumno.src = alumno.imagen;
//         console.log(alumno);
//         return;
//       }
//     })
//     if(alumno==null){
//       nombreAlumno.innerHTML = 'Alumno no encontrado';
//       imgAlumno.src = '';
//     }
//   })
// });



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
      mostrarMensaje(alert,'err','Código no encontrado'); 
  })
})

btnWrite.addEventListener('click',e=>{
  e.preventDefault();
  socket.emit('write:arduino',`${alumno.codigo}-${alumno.apellidos}`);
})

// socket.on('arduino:data',data=>{
//   msg.innerHTML = 'Nombre: '+data.nombre;
// })
//Escuchar socket
socket.on('connect:success',()=>{
  btnConnect.style.display = 'none';
  imgArduino.style.display = 'none';
  formRegistrar.style.display = 'block';
  //redireccionar a otra vista 
});


socket.on('write:success',()=>{
  mostrarMensaje(alert,'success','Código y Usuario Registrado'); 
  dataAlumno.value = 'Esperando...';
  codigo.value='';
  btnWrite.disabled = true;
})