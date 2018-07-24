const socket = io();

const btnConectar = document.getElementById('conectar');
const btnRegistrar = document.getElementById('registrar');
const btnBuscar = document.getElementById('buscar');
const codigo = document.getElementById('codigo') ;
const idalumno = document.getElementById('idalumno');
const nombres = document.getElementById('nombres');
const apaterno = document.getElementById('apaterno');
const amaterno = document.getElementById('amaterno');

btnBuscar.addEventListener('click',(e)=>{
  e.preventDefault();
  if(codigo.value != ''){
    let url = ''
    if(codigo.value.substr(0,3)=='020'){
      url = 'http://localhost:4000/api/alumno/';
    }else{
      url = 'http://localhost:4000/api/docente/email/';
    }
    fetch(url+codigo.value)
    .then(res=>res.json())
    .then(res=>{
      if(res.success){
        nombres.value = res.data.nombres.split(' ')[0];
        apaterno.value = res.data.apellido_paterno;
        amaterno.value = res.data.apellido_materno;
        idalumno.value = codigo.value;
      }else{
        alertify.error('Código inválido o no registrado');
      }
    })    
  }else{
    alertify.warning('El código no puede estar vacío');
  }
})

btnRegistrar.addEventListener('click',(e)=>{
  e.preventDefault();
  if(nombres.value != '' && apaterno.value != '' && amaterno.value != '' && idalumno.value != ''){
    let data = {codigo:idalumno.value,nombres:nombres.value,apellido_paterno:apaterno.value,apellido_materno:amaterno.value};
    socket.emit('write:arduino',data);
  }else{
    alertify.warning('Los datos están vacíos');
  }
})

btnConectar.addEventListener('click',()=>{
  socket.emit('connect:arduino');
})

socket.on('connect:success',()=>{
  alertify.success('Arduino conectado')
})

socket.on('write:success',()=>{
  alertify.success('Carné registrado')
})