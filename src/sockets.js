const {getConnectedArduino} = require('./functions');
const SerialPort = require('serialport');


module.exports = (io)=>{
  io.on('connection',socket=>{
    //console.log('new user connected');
    let isConnect = false;
    let mySP;
    //Conectar la placa Arduino a SerialPort
    socket.on('connect:arduino', async ()=>{
      let success = await getConnectedArduino(SerialPort);
      if(!success) return;
      socket.emit('connect:success')
      mySP = sp;
      const Readline = SerialPort.parsers.Readline
      const parser = new Readline();
      sp.pipe(parser);
      parser.on('data',data=>{     
        data = data.toString().trim();
        if(data.includes('success')){
          io.emit('write:success')
        }        
        io.emit('read:code',data);    
        //console.log(data.toString().trim());
      })        
    });
    //Escribir datos
    socket.on('write:arduino', data=>{
      //console.log(data);
      sp.write(data.codigo+'#'+data.nombres+'#'+data.apellido_paterno+'#'+data.apellido_materno+'#');
    });
  })
}