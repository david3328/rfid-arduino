const socket = io();
const btnConnect = document.getElementById('connect');
const msg = document.getElementById('msg');
const options = document.getElementById('options');
const write = document.getElementById('write');
const btnWrite = document.getElementById('btnWrite');
const btnSend = document.getElementById('send');
const code = document.getElementById('code');


btnConnect.addEventListener('click', e => {
  e.preventDefault();
  socket.emit('connect:arduino');
  msg.innerHTML = 'Intentando conectar...';
})

btnWrite.addEventListener('click', e => {
  e.preventDefault();
  write.style.display = 'block';
  options.style.display = 'none';
})

btnSend.addEventListener('click', e => {
  e.preventDefault();
  let codevalue = code.value;
  socket.emit('write:arduino',codevalue);
})


//Escuchar socket
socket.on('connect:success',()=>{
  msg.innerHTML = 'Arduino conectado';
  btnConnect.style.display = 'none';
  options.style.display = 'block';
  //redireccionar a otra vista 
});

socket.on('write:success',()=>{
  code.value = '';
  msg.innerHTML = 'Arduino conectado: Código escrito';
})

socket.on('arduino:data',data=>{
  msg.innerHTML = 'Nombre: '+data.nombre;
})
