const {getConnectedArduino} = require('./functions');
const SerialPort = require('serialport');

module.exports = (io)=>{
  io.on('connection',socket=>{
    console.log('new user connected');
    //Conectar la placa Arduino a SerialPort
    socket.on('connect:arduino', async ()=>{
      let success = await getConnectedArduino(SerialPort);
      if(success) socket.emit('connect:success');
    });
    //Escribir datos
    socket.on('write:arduino', data=>{
        sp.write(data+'#')
        const Readline = SerialPort.parsers.Readline
        const parser = new Readline();
        sp.pipe(parser);
        parser.on('data',data=>{
            data = data.toString().trim();
            if(data.includes('success')){
              socket.emit('write:success')
            }
            console.log(data.toString().trim());
        })        
    });
  })
}