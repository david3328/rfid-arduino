const titulo = document.getElementById('titulo');
const table = document.getElementById('alumnos');
const socket = io();


let data = new Date();

setInterval(()=>{
  data.setSeconds(data.getSeconds() + 1);
  let hora = data.toLocaleTimeString('it-IT');
  titulo.innerHTML = `ASISTENCIA ${data.toLocaleDateString()} ${hora}`;  
},1000);



socket.on('read:code',(data)=>{
  let miData = data.split('-');
  let codigo = miData[0];
  let nombre = miData[1];
  let apaterno = miData[2];
  let amaterno = miData[3];
  let html = table.outerHTML;
  let date = new Date();
  html += `<tr>
  <td>${codigo}</td>
  <td>${nombre}</td>
  <td>${apaterno} ${amaterno}</td>
  <td>${date.toLocaleDateString()} ${date.toLocaleTimeString('it-IT')}</td>
</tr>`;
 table.innerHTML = html;
});