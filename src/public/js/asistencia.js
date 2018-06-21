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
  let date = new Date();
  let fecha = `${date.toLocaleDateString()} ${date.toLocaleTimeString('it-IT')}`;

  let asistencia = {codigo,nombre,apaterno,amaterno,fecha}
  if(localStorage.getItem('asistencia')){
    let store = JSON.parse(localStorage.getItem('asistencia'));
    let index = store.indexOf(asistencia);
    if(index===-1){
      store.push(asistencia);
    }
    localStorage.setItem('asistencia',JSON.stringify(store));
  }else{
    let store = [];
    store.push(asistencia);
    localStorage.setItem('asistencia',JSON.stringify(store));
  }

  let store = JSON.parse(localStorage.getItem('asistencia'));
  let html = '';
  store.map(el=>{
    html += `<tr>
      <td>${codigo}</td>
      <td>${nombre}</td>
      <td>${apaterno} ${amaterno}</td>
      <td>${fecha}</td>
    </tr>`;
  });  
 table.innerHTML = html;
});