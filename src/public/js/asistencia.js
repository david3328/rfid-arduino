const titulo = document.getElementById('titulo');
const socket = io();


let data = new Date();

setInterval(()=>{
  data.setSeconds(data.getSeconds() + 1);
  let hora = data.toLocaleTimeString('it-IT');
  titulo.innerHTML = `ASISTENCIA ${data.toLocaleDateString()} ${hora}`;  
},1000);



// socket.on('read:code',(data)=>{
//   console.log(data);
// });