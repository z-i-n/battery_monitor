// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const serialport = require('serialport');
const log = require('./log');
//const createTable = require('data-table');

function convertFromHex(hex) {
    var hex = hex.toString(); //force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

function convertToHex(str) {
    var hex = '';
    for (var i = 0; i < str.length; i++) {
        hex += '' + str.charCodeAt(i).toString(16);
    }
    return hex;
}
function infoMsg(str) {
    console.log(str);
    $('#info').text(str);
}
function openPort() {
    serialport.list((err, ports) => {
        console.log('ports', ports);
        if (err) {
            infoMsg('Serial Port Connection Error');
            return;
        }

        if (ports.length === 0) {
            infoMsg('No ports discovered');
            return;
        }

        const headers = Object.keys(ports[0])
        ports.forEach(port => {
            console.log(port)
            if (port.comName.indexOf('usbserial') >= 0) {
                usbSerial.port = openSerial(port.comName);
            }
        });
    });
}

function openSerial(portName) {
    const port = new serialport(portName, {
        baudRate: 9600
    });
    port.on('error', function(err) {
        console.log('port open error', err);
        infoMsg('cannot open ' + portName);
    });
    // The open event is always emitted
    port.on('open', function() {
        // open logic
        console.log('port open');
        infoMsg('Connection');
        $('#port').text(portName);
    });
    // Read data that is available but keep the stream in "paused mode"
    let count = 0;
    let data = [];
    port.on('readable', function() {
        var int8View = new Int8Array(port.read());

        for (var i = 0; i < int8View.length; i++) {
            if (int8View[i] === 2) {
                data = [];
            } else if (int8View[i] === 3) {
                usbSerial.emit('data', data);
            } else {
                data.push(String.fromCharCode(int8View[i]));
            }
        }
    });

    // Switches the port into "flowing mode"
    //port.on('data', function(data) {
        //console.log('Data:', (data))
    //})

    port.open(function(err) {
        if (err) {
            //infoMsg(err.message == 'Port is opening' ? 'connection' : 'Error opening port: ' + err.message);
        }
        // Because there's no callback to write, write errors will be emitted on the port:
        // port.write(convertToHex("hi"), function(err) {
        //     if (err) {
        //         return console.log('Error on write: ', err.message)
        //     }
        //     console.log('message written')
        // });
    });
    return port;
}

function arrToStr(arr) {
    return Number(parseInt(arr.join().replace(/,/g, ''))/10).toFixed(1);
}
function getChargeState(code) {
    switch(code) {
        case "0":
            return '대기';
        case "1":
            return '방전중';
        case "2":
            return '충전중';
        case "3":
            return '비상정지';
    }
}
function getState(code) {
    return code == "0" ? '정상' : '이상';
}
const usbSerial = {
    event: {},
    on(eventName, func) {
        this.event[eventName] = func;
    },
    emit(eventName, data) {
        if (this.event[eventName]) {
            let ret, volts = [], temps = [];
            temps.push(arrToStr(data.slice(2, 5)));
            temps.push(arrToStr(data.slice(6, 9)));
            temps.push(arrToStr(data.slice(10, 13)));
            temps.push(arrToStr(data.slice(14, 17)));

            volts.push(arrToStr(data.slice(18, 21)));
            volts.push(arrToStr(data.slice(22, 25)));
            volts.push(arrToStr(data.slice(26, 29)));
            volts.push(arrToStr(data.slice(30, 33)));
            ret = {
                volts,
                temps,
                chargeState: [data[34], getChargeState(data[34])],
                inputState: [data[35], getState(data[35])],
                bmsState: [data[36], getState(data[36])]
            };
            log.saveLog(volts, temps);
            this.event[eventName](ret);
        }
    },
    send(data) {
        this.port.write(data, function(err) {
            if (err) {
                return console.log('Error on write: ', err.message)
            }
            console.log('message written');
        });
    },
    openPort
}

module.exports = usbSerial;
