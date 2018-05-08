const getConnectedArduino = async SerialPort => {
  var done = false
  await SerialPort.list(function(err, ports) {
    var allports = ports.length;
    var count = 0;
    ports.forEach(function(port) {
      count += 1;
      pm = port['manufacturer'];
      if (typeof pm !== 'undefined' && pm.includes('arduino')) {
        arduinoport = port.comName.toString();
        var serialPort = require('serialport');
        sp = new serialPort(arduinoport, {
          buadRate: 9600
        })
        sp.on('open', function() {
          console.log('done! arduino is now connected at port: ' + arduinoport)
        })
        done = true;
      }
      if (count === allports && done === false) {
         console.log('cant find arduino')
      }
    });

  });
  return done;
}

module.exports = {getConnectedArduino}