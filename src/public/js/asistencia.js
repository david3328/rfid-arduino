const titulo = document.getElementById('titulo');

let data = new Date().toLocaleDateString();
console.log(data);

titulo.innerHTML = `ASISTENCIA ${data}`;