const docentes = document.getElementById('docentes');
const cursos = document.getElementById('cursos');
const btnRegistrar = document.getElementById('registrar');
listarDocentes();

docentes.addEventListener('change', () => {
  if (docentes.value != -1) {
    listarCursos(docentes.value);
  }
})

btnRegistrar.addEventListener('click', (e) => {
  e.preventDefault();
  if (docentes.value != -1 && cursos.value != -1) {
    alertify.confirm("¿Deseas crear asistencia para éste horario?",
      function () {
        let data = {idHorario:cursos.value}
        fetch('http://localhost:4000/api/asistencia/crear',{
          method:'post',
          headers:{
            'Content-Type':'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(res=>res.json())
        .then(res=>{
          if(res.success){
            alertify.success('Asistencia creada.')
          }else{
            alertify.error(res.message)
          }
        })
      },
      function () {
        alertify.error('Cancelado');
      });
  } else {
    alertify.warning('Seleccionar datos válidos.');
  }
})


function listarDocentes() {
  fetch('http://localhost:4000/api/asistencia/profesores')
    .then(res => res.json())
    .then(res => {
      if (res.success == true) {
        if (res.data.length > 0) {
          let html = `<option value='-1'>Seleccionar docente</option>`;
          res.data.map(el => {
            html += `<option value='${el.id_docente}'>${el.docente}</option>`
          })
          docentes.innerHTML = html;
        } else {
          docentes.innerHTML = `<option value='-1'>No hay docentes registrados</option>`
        }
      }
    })
}

function listarCursos(docente) {
  fetch(`http://localhost:4000/api/asistencia/cursos/${docente}`)
    .then(res => res.json())
    .then(res => {
      if (res.success == true) {
        if (res.data.length > 0) {
          let html = `<option value='-1'>Seleccionar curso</option>`;
          res.data.map(el => {
            html += `<option value='${el.id_horario}'>${el.id_grupo} - ${el.dia} de ${el.hora_inicio} a ${el.hora_fin} - ${el.nombre}</option>`
          })
          cursos.innerHTML = html;
        } else {
          cursos.innerHTML = `<option value='-1'>No hay cursos registrados</option>`
        }
      }
    })
}