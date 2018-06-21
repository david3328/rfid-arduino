const data = document.getElementById('alumnos');

fetch('/alumnos')
.then(res=>res.json())
.then(res=>{
  let html = '';
  let cont = 0;
  res.map(el=>{
    cont ++;
    html += `<tr>
      <th scope="row">${cont}</th>
      <td>${el.id_alumno}</td>
      <td>${el.nombres}</td>
      <td>${el.apellido_paterno} ${el.apellido_materno}</td>
      <td>${el.curso}</td>
    </tr>`;
  });
  data.innerHTML = html;
})

