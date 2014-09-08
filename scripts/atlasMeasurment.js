var gpio = require('rpi-gpio');
var async = require('async');
var SerialPort = require("serialport").SerialPort;

var serialPort = new SerialPort("/dev/ttyAMA0", {
  baudrate: 38400
});

gpio.on('change', function(channel, value) {
    console.log('Channel ' + channel + ' value is now ' + value);
});

gpio.on('error', function(channel, value) {
    console.log('Channel ' + channel + ' value is now ' + value);
});


async.parallel([
    function(callback) {
        gpio.setup(16, gpio.DIR_OUT, callback);
    },
    function(callback) {
        gpio.setup(18, gpio.DIR_OUT, callback);
    }
], function(err, results) {
	console.log('Pins set up');
	writePins();
});

function writePins(){
//	async.series([
//		function(callback) {
			gpio.write(16, false, function(err) {
                		if (err) throw err;
                		console.log('Written to pin 16');
			});
  //      	},
    //    	function(callback) {
			gpio.write(18, false, function(err) {
                		if (err) throw err;
                		console.log('Written to pin 18');
        		});
  //      	}], function(err, results) {
			console.log('Writes complete');
			setTimeout(readValue, 5000);		
//		});
}

function close() {
    gpio.destroy(function() {
        console.log('All pins unexported');
        //return process.exit(0);
    });
	serialPort.close(function(){
		console.log('Serial Port closed');
	});
	setTimeout(finish, 1000);
}

function finish(){
	 process.exit(0);
}

function readValue() {
	serialPort.open(function () {
  		console.log('open');
		serialPort.on('data', function(data) {
			console.log('data received: ' + data);
  		});
		serialPort.write("\r");
		serialPort.write("25.90\r");
		serialPort.write("R\r");

		serialPort.drain(function(err){
			console.log('err2 ' + err);
		});
		setTimeout(close, 10000);
	});
}
