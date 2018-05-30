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
