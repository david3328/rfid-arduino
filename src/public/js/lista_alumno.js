 // Initialize Firebase
 var config = {
  apiKey: "AIzaSyBJ6_7cKvHmZyuOnj5vr2lr4AIG8wwjZaw",
  authDomain: "rfid-arduino.firebaseapp.com",
  databaseURL: "https://rfid-arduino.firebaseio.com",
  projectId: "rfid-arduino",
  storageBucket: "rfid-arduino.appspot.com",
  messagingSenderId: "887710525160"
};
firebase.initializeApp(config);

const db = firebase.database();
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