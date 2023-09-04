console.log('HELLO WORLD');
const { SerialPort } = require('serialport');
console.log("SERIAL PORT");
// const { ReadlineParser } = require('@serialport/parser-readline');

// const port = new SerialPort('/dev/tty.usbmodem144301', { baudRate: 9600 }); // Replace 'COMx' with your Arduino's port
const port = new SerialPort({
    path: '/dev/cu.usbmodem144301',
    baudRate: 9600,
  })
console.log("PORT");
// const parser = port.pipe(new Readline({ delimiter: '\n' }));


// parser.on('data', (data) => {
//     // Handle data received from Arduino here
//     if (data === 'YELLOW') {
//       console.log('OMG BLUE PRESSED');
//     } else if (data === 'GREEN') {
//         console.log('OMG GREEN PRESSED');
//     } else if (data === 'BLUE') {
//         console.log('OMG GREEN PRESSED');
//     }
//   });
port.on('data', function (data) {
    console.log('Data:', data)
  });