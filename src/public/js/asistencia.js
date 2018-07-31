const socket = io();

const btnConectar = document.getElementById('conectar');
const btnGuardar = document.getElementById('guardar');
const btnCheck = document.getElementById('check');
const titulo = document.getElementById('titulo');
const titulo_curso = document.getElementById('titulo_curso');
const tabla = document.getElementById('tabla');
const body = document.getElementById('body');
listarAlumnos();




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
      localStorage.removeItem('asistencia-telein');
      titulo_curso.innerHTML = 'NO HAY ASISTENCIA ACTIVADA';
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
      fetch('http://localhost:4000/api/asistencias/ingresar',{
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
  objAlumno.hora = getTimeStamp();
  console.log(objAlumno);
  let alumnos = localStorage.getItem('alumnos-asistencia')? JSON.parse(localStorage.getItem('alumnos-asistencia')) : [];
  let alumno = alumnos.find(e=>e.codigo === objAlumno.codigo);
  if(!alumno){
    if(objAlumno.codigo.substr(0,3)=='020'){
      if(localStorage.getItem('asistencia-telein')){
        let lista_matriculados = JSON.parse(localStorage.getItem('alumnos-matriculados'));
        let ialumno = lista_matriculados.find(el=>el.id_alumno==objAlumno.codigo);
        if(ialumno){
          objAlumno.alumno = `${ialumno.nombres} ${ialumno.apellido_paterno} ${ialumno.apellido_materno}`
        }else{
          objAlumno.alumno = 'ALUMNO NO MATRICULADO';
        }
        alumnos.push(objAlumno);
        localStorage.setItem('alumnos-asistencia',JSON.stringify(alumnos));
        guardarAsistencia(objAlumno.codigo,objAlumno.hora);
      }else{
        alertify.error('PRIMERO ACTIVAR ASISTENCIA');
      }    
    }else{  
      if(localStorage.getItem('asistencia-telein')){
        if(objAlumno.codigo == localStorage.getItem('docente-telein')){
          finalizarAsistencia();
          tableToExcel('testTable', 'W3C Example Table')
          localStorage.removeItem('alumnos-asistencia');
          localStorage.removeItem('asistencia-telein');
          titulo_curso.innerHTML = 'NO HAY ASISTENCIA ACTIVADA';
          listarAlumnos();
          alertify.success('Datos guardados');
        }else{
          alertify.error('Código docente incorrecto');
        }       
      }else{
        localStorage.setItem('docente-telein',objAlumno.codigo);
        docenteAsistencia(objAlumno.codigo);
      }
    }

  }
  listarAlumnos();
})

function listarAlumnos(){
  if(localStorage.getItem('asistencia-telein'))
    titulo_curso.innerHTML = JSON.parse(localStorage.getItem('asistencia-telein')).curso;
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


function finalizarAsistencia(){
  let asistencia = JSON.parse(localStorage.getItem('asistencia-telein')).id;
  fetch('http://localhost:4000/api/asistencias/finalizar',{
    method:'post',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({asistencia})
  })
  .then(res=>res.json())
  .then(res=>{
    if(res.success){
      alertify.success('ASISTENCIA FINALIZADA');
    }
  })
}

function guardarAsistencia(idalumno,hora){
    let asistencia = JSON.parse(localStorage.getItem('asistencia-telein')).id;
    let data = {idAlumno:idalumno,idAsistencia:asistencia,date:hora}
    fetch('http://localhost:4000/api/asistencias/ingresar',{
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
          idasistencia: JSON.parse(localStorage.getItem('asistencia-telein')).id,
          hora:hora
        })
        localStorage.setItem('asistencia-offline',JSON.stringify(asistenciaOffline));
      }
    })

  
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
  let data= {email:docente};
  fetch('http://localhost:4000/api/asistencia/crear',{
      method:'post',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res=>res.json())
    .then(res=>{
      if(res.success && data!=null){
        let curso = res.data[0]._curso;
        let idasistencia = res.data[0]._idasistencia;
        let datos = {curso,id:idasistencia}
        localStorage.setItem('asistencia-telein',JSON.stringify(datos));
        titulo_curso.innerHTML = `CURSO: ${curso}`;
        localStorage.setItem('alumnos-matriculados',JSON.stringify(res.data[0]._response));
        alertify.success('Asistencia Creada');
      }else{
        alertify.error(res.message)
      }
    })
}