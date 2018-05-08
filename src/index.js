const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname,'public')));

require('./sockets')(io);

//Listen server
server.listen(app.get('port'),()=>{
  console.log(`Server on port ${app.get('port')}`);
});