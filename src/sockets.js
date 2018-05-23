const {getConnectedArduino} = require('./functions');
const SerialPort = require('serialport');
// const pg = require('pg-promise')();
// const {connectionString} = require('./cfg/core');
// otra prueba
module.exports = (io)=>{
  io.on('connection',socket=>{
    console.log('new user connected');
    //Conectar la placa Arduino a SerialPort
    socket.on('connect:arduino', async ()=>{
      let success = await getConnectedArduino(SerialPort);
      if(!success) return;
      socket.emit('connect:success')
      // const db = pg(connectionString);       
      const Readline = SerialPort.parsers.Readline
        const parser = new Readline();
        sp.pipe(parser);
        parser.on('data',data=>{     
            data = data.toString().trim();
            if(data.includes('success')){
              socket.emit('write:success')
            }
            // db.one(`select * from persona where login = '${data.toString().trim()}'`)
            // .then(data => {
            //     io.emit('arduino:data',data);
            // })
            // .catch(error => {
            //     console.log(error);
            // });
            console.log(data.toString().trim());
        })        
    });
    //Escribir datos
    socket.on('write:arduino', data=>{
        sp.write(data+'#')
    });
  })
}