const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const port = new SerialPort({
    path: '/dev/cu.usbmodem144301',
    baudRate: 9600,
  })
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))


parser.on('data', (data) => {
    // Handle data received from Arduino here
    if (data === 'YELLOW') {
      console.log('OMG YELLOW PRESSED');
    } else if (data === 'GREEN') {
        console.log('OMG GREEN PRESSED');
    } else if (data === 'BLUE') {
        console.log('OMG BLUE PRESSED');
    }
  });
