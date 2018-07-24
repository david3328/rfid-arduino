const socket = io();

const btnConectar = document.getElementById('conectar');
const btnGuardar = document.getElementById('guardar');
const btnCheck = document.getElementById('check');
const asistencias = document.getElementById('asistencias');
const titulo = document.getElementById('titulo');
const tabla = document.getElementById('tabla');
const body = document.getElementById('body');
listarAsistencias();
listarAlumnos();

function listarAsistencias(){
  fetch('http://localhost:4000/api/asistencia')
  .then(res=>res.json())
  .then(res=>{
    if (res.success == true) {
      if (res.data.length > 0) {
        let html = `<option value='-1'>Seleccionar asistencia</option>`;
        res.data.map(el => {
          html += `<option value='${el.id_asistencia}'>${el.id_grupo} ${el.nombre} - ${el.dia} de ${el.hora_inicio} a ${el.hora_fin} - ${el.nombres} ${el.apellido_paterno}</option>`
        })
        asistencias.innerHTML = html;
      } else {
        asistencias.innerHTML = `<option value='-1'>No hay asistencias registradas hoy</option>`
      }
    }
  })
}


setInterval(()=>{
  titulo.innerHTML = `ASISTENCIA ${getTimeStamp()}`;  
},1000);

btnConectar.addEventListener('click',()=>{
  socket.emit('connect:arduino');
})

btnGuardar.addEventListener('click',()=>{
  // if(body.getAttribute('class') != 'offline')
  //   body.classList.add('offline');      
  if(localStorage.getItem('alumnos-asistencia')){
    alertify.confirm("¿Deseas crear asistencia para éste horario?",
    function(){
      tableToExcel('testTable', 'W3C Example Table')
      localStorage.removeItem('alumnos-asistencia');
      listarAlumnos();
      alertify.success('Datos guardados');
    },
    function(){
      alertify.error('Cancelado');
    })   
  }else{
    alertify.error('No hay asistencias registradas')
  }
  
})

btnCheck.addEventListener('click',()=>{
  if(localStorage.getItem('asistencia-offline')){
    let asistenciasOffline = JSON.parse(localStorage.getItem('asistencia-offline'));
    let count = asistenciasOffline.length;
    asistenciasOffline.map(el=>{
      let data = {idAlumno:el.idalumno,idAsistencia:el.idasistencia,date:el.hora}
      fetch('http://localhost:4000/api/asistencia/ingresar',{
        method:'post',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(res=>res.json())
      .then(res=>{
        console.log(res);
      })
      .catch(err=>alertify.error(err.message))
    })
    localStorage.removeItem('asistencia-offline');
    alertify.success(`${count} asistencias ingresadas.`);
  }else{
    alertify.success('No hay asistencias guardadas');
  }

})

socket.on('connect:success',()=>{
  alertify.success('Arduino conectado')
})

socket.on('read:code',data=>{
  console.log(data);
  let objAlumno = {};
  let alumnoEntrante = data.split('-');
  objAlumno.codigo = alumnoEntrante[0];
  objAlumno.alumno = `${alumnoEntrante[1]} ${alumnoEntrante[2]} ${alumnoEntrante[3]}`;
  objAlumno.hora = getTimeStamp();
  let alumnos = localStorage.getItem('alumnos-asistencia')? JSON.parse(localStorage.getItem('alumnos-asistencia')) : [];
  let alumno = alumnos.find(e=>e.codigo === objAlumno.codigo);
  if(!alumno){
    if(asistencias.value != -1 ){
    alumnos.push(objAlumno);
    localStorage.setItem('alumnos-asistencia',JSON.stringify(alumnos));
    if(objAlumno.codigo.substr(0,3)=='020'){
      guardarAsistencia(objAlumno.codigo,objAlumno.hora);
    }else{  
      docenteAsistencia(objAlumno.codigo);
    }
    }else{
      alertify.error('No ha seleccionado asistencia')
    }
  }
  listarAlumnos();
})

function listarAlumnos(){
  let alumnos = localStorage.getItem('alumnos-asistencia')? JSON.parse(localStorage.getItem('alumnos-asistencia')) : [];
  if(alumnos.length>0){
    let html = '';
    alumnos.map(el=>{
      html += `<tr>
            <td>${el.codigo}</td>
            <td>${el.alumno}</td>
            <td>${el.hora.substr(10,19)}</td>
          </tr>`
    })
    tabla.innerHTML = html;
  }else{
    tabla.innerHTML = `<td colspan="3"><p class="text-danger text-center">No hay alumnos registrados.</p></td>`
  }
}

function guardarAsistencia(idalumno,hora){
  if(asistencias.value != -1 ){
    let data = {idAlumno:idalumno,idAsistencia:asistencias.value,date:hora}
    fetch('http://localhost:4000/api/asistencia/ingresar',{
      method:'post',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res=>res.json())
    .then(res=>{
      if(body.getAttribute('class') == 'offline')
        body.classList.remove('offline');
      
    })
    .catch(err=>{
      if(body.getAttribute('class') != 'offline')
        body.classList.add('offline');      
      //Guardar idalumno e idasistencia en un localStorage
      let asistenciaOffline = localStorage.getItem('asistencia-offline')? JSON.parse(localStorage.getItem('asistencia-offline')) : [];
      let asistencia = asistenciaOffline.find(el=>el.idalumno == idalumno);
      if(!asistencia){
        asistenciaOffline.push({
          idalumno:idalumno,
          idasistencia: asistencias.value,
          hora:hora
        })
        localStorage.setItem('asistencia-offline',JSON.stringify(asistenciaOffline));
      }
    })
  }else{
    alertify.error('No ha seleccionado asistencia')
  }
  
}

var tableToExcel = (function() {
  var uri = 'data:application/vnd.ms-excel;base64,'
    , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
    , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
    , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
  return function(table, name) {
    if (!table.nodeType) table = document.getElementById(table)
    var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
    window.location.href = uri + base64(format(template, ctx))
  }
})()

function getTimeStamp() {
  var now = new Date();
  return (now.getFullYear()) + '-' + ((((now.getMonth() + 1)<10)? ("0"+(now.getMonth() + 1)) : (now.getMonth() + 1))) + '-' + (now.getDate()<10? ("0"+now.getDate()):now.getDate()) + " " + now.getHours() + ':'
                + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now
                .getSeconds()) : (now.getSeconds()));
}

function docenteAsistencia(docente){
  let data= {email:docente,asistencia:asistencias.value};
  fetch('http://localhost:4000/api/asistencia/ingresar/docente',{
      method:'post',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res=>res.json())
    .then(res=>{
      if(res.success){
        alertify.success('Docente ingresado');
      }else{
        alertify.error(res.message)
      }
    })
}