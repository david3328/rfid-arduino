//Datos 
const codigo = document.getElementById('codigo_universitario');
const nombre = document.getElementById('nombres_alumno');
const apellidoPaterno = document.getElementById('apellido_paterno');
const apellidoMaterno = document.getElementById('apellido_materno');
const curso = document.getElementById('curso');
const btnRegistrar = document.getElementById('registrar');
const alert = document.getElementById('alert');


alert.style.display= 'none';
btnRegistrar.addEventListener('click', e=>{
  e.preventDefault();
  let cursoText = curso.options[curso.selectedIndex].text;
  if(codigo.value && nombre.value && apellidoPaterno.value && apellidoMaterno.value && cursoText && curso.value!=''){
    let alumno = {
      id_alumno:codigo.value,
      nombres:nombre.value,
      apellido_paterno:apellidoPaterno.value,
      apellido_materno:apellidoMaterno.value,
      curso:cursoText
    }
    fetch('/alumnos',{
      method:'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(alumno),
    })
    .then(res=>res.json())
    .then(res=>{
      if(res.success){
        mostrarMensaje(alert,'success','Alumno registrado');
        codigo.value = '';
        nombre.value = '';
        apellidos.value = '';
        curso.value = '';
      }else{
        mostrarMensaje(alert,'err','Ocurrió un error al guardar');
      }
    })
  }else{
    mostrarMensaje(alert,'err','Los datos deben estar completos');
  }
});
