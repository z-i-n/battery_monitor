// Chartist = require('chartist');
// require('chartist-plugin-legend');
const c3 = require('c3');

function displayLog() {

    let voltLogs = JSON.parse(localStorage.getItem('volts')) || [];
    let tempLogs = JSON.parse(localStorage.getItem('temps')) || [];

    var chart = c3.generate({
            bindto: '#chart_voltage',
            data: {
                columns: getLog(voltLogs)
            }
        });
    var chart = c3.generate({
        bindto: '#chart_temperature',
        data: {
            columns: getLog(tempLogs)
        }
    });
    // new Chartist.Line('.voltage', {
    //     // labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    //     series: getLog(voltLogs)
    //   }, {
    //     fullWidth: true,
    //     chartPadding: {
    //       right: 40
    //     },
    //     plugins: [
    //         Chartist.plugins.legend({
    //             position: 'bottom'
    //         })
    //     ]
    //   });

    //   new Chartist.Line('.temperature', {
    //     // labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    //     series: getLog(tempLogs)
    //   }, {
    //     fullWidth: true,
    //     chartPadding: {
    //       right: 40
    //     },
    //     plugins: [
    //         Chartist.plugins.legend({
    //             position: 'bottom'
    //         })
    //     ]
    //   });
}

 function getLog(data) {
    let ret = [];
//     data.forEach((value, index)=>{
//         ret.push({
//             name: 'Cell '+(index+1), data: value
//         });
//     });
    data.forEach((value, index)=>{
        let arr = Object.assign([], value);
        arr.unshift('Cell '+(index+1));
        ret.push(arr);
    });
    return ret;
}


function saveLog(volts, temps) {

    let voltLogs = JSON.parse(localStorage.getItem('volts')) || [];
    let tempLogs = JSON.parse(localStorage.getItem('temps')) || [];

    volts.forEach((value, index) => {
        if (!voltLogs[index]) {
            voltLogs[index] = [];
        }
        voltLogs[index].push(value);
        if (voltLogs[index].length > 20) {
            voltLogs[index].shift();
        }
    });

    temps.forEach((value, index) => {
        if (!tempLogs[index]) {
            tempLogs[index] = [];
        }
        tempLogs[index].push(value);

        if (tempLogs[index].length > 20) {
            tempLogs[index].shift();
        }
    });

    localStorage.setItem('volts', JSON.stringify(voltLogs));
    localStorage.setItem('temps', JSON.stringify(tempLogs));
}

module.exports = {
    displayLog,
    saveLog
};
