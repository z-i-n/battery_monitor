// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
window.$ = window.jQuery = require('jquery');
const log = require('./log');
const serial = require('./serial');

// document.querySelector('#run').addEventListener('click', function(){

//   port.write("R", function(err) {
//     if (err) {
//       return console.log('Error on write: ', err.message)
//     }
//     console.log('message written')
//   });
// }, false);


// document.querySelector('#stop').addEventListener('click', function(){
//   console.log(convertToHex("S"));
//   port.write("S", function(err) {
//     if (err) {
//       return console.log('Error on write: ', err.message)
//     }
//     console.log('message written')
//   });
// }, false);

document.querySelector('.monitor-tab').addEventListener('click', function(evt){
  $('.nav.nav-tabs .active').removeClass('active');
  $(evt.currentTarget).addClass('active');
  document.querySelector('.monitor-area').style.display = 'block';
  document.querySelector('.log-area').style.display = 'none';
}, false);
document.querySelector('.log-tab').addEventListener('click', function(evt){
  $('.nav.nav-tabs .active').removeClass('active');
  $(evt.currentTarget).addClass('active');
  document.querySelector('.monitor-area').style.display = 'none';
  document.querySelector('.log-area').style.display = 'block';
  log.displayLog();
}, false);

let voltElem = $('#volt_cell td');
let tempElem = $('#temp_cell td');
let stateElem = $('#state span.badge');
let btnCommand = $('#command_btn');
btnCommand.on('click', function(evt){
  if ($(this).hasClass('btn-danger')) {
    serial.send('S');
  } else {
    serial.send('R');
  }
});
serial.openPort();
serial.on('data', function(data) {
  if (data.volts) {
    voltElem.each((index, elem)=>{
      $(elem).text(data.volts[index]+'V');
    });
    tempElem.each((index, elem)=>{
      $(elem).text(data.temps[index]+'°C');
    });
    stateElem.eq(0).removeClass().text(data.chargeState[1]);
    if (data.chargeState[0] == 3) {
      stateElem.eq(0).addClass('badge badge-danger');
      btnCommand.text('Run').removeClass('btn-secondary btn-danger').addClass('btn-primary');
    } else {
      btnCommand.text('Stop').removeClass('btn-secondary btn-primary').addClass('btn-danger');
      if (data.chargeState[0] == 2) {
        stateElem.eq(0).addClass('badge badge-success');
      } else if (data.chargeState[0] == 1) {
        stateElem.eq(0).addClass('badge badge-warning');
      } else {
        stateElem.eq(0).addClass('badge badge-warning');
      }
    }
    stateElem.eq(1).text(data.inputState[1]);
    if (data.inputState[0] == 1) {
      stateElem.eq(1).addClass('badge badge-danger');
    } else {
      stateElem.eq(1).addClass('badge badge-success');
    }
    stateElem.eq(2).text(data.bmsState[1]);
    if (data.bmsState[0] == 1) {
      stateElem.eq(2).addClass('badge badge-danger');
    } else {
      stateElem.eq(2).addClass('badge badge-success');
    }
  }
});
