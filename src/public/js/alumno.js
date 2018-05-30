//Datos 
const codigo = document.getElementById('codigo_universitario');
const nombre = document.getElementById('nombres_alumno');
const apellidos = document.getElementById('apellidos_alumno');
const curso = document.getElementById('curso');
const btnRegistrar = document.getElementById('registrar');
const alert = document.getElementById('alert');


alert.style.display= 'none';
btnRegistrar.addEventListener('click', e=>{
  e.preventDefault();
  if(codigo.value && nombre.value && apellidos.value && curso.value){
    let alumno = {
      codigo:codigo.value,
      nombre:nombre.value,
      apellidos:apellidos.value,
      curso:curso.value
    }
    db.ref('alumnos').push(alumno,err=>{
      if(err){
        mostrarMensaje(alert,'err','Ocurrió un error al guardar');
      }else{
        mostrarMensaje(alert,'success','Alumno registrado');
        codigo.value = '';
        nombre.value = '';
        apellidos.value = '';
        curso.value = '';
      }
    });
  }else{
    mostrarMensaje(alert,'err','Los datos deben estar completos');
  }
});
