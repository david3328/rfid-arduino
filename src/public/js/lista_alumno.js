const data = document.getElementById('alumnos');

db.ref('alumnos').on('value',snapshot=>{
  let alumnos = Object.values(snapshot.val());
  let html = '';
  let cont = 0;
  alumnos.forEach(alumno=>{
    cont++;
    html += `<tr>
    <th scope="row">${cont}</th>
    <td>${alumno.codigo}</td>
    <td>${alumno.nombre}</td>
    <td>${alumno.apellidos}</td>
    <td>${alumno.curso}</td>
  </tr>`;
  });
  data.innerHTML = html;
})