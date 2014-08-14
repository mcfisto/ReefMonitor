/**
 * Atlas Scientific probe manipulation.
 */

var gpio = require('rpi-gpio');
var async = require('async');

var MeasurementDao = require("./dao/MeasurementDao")();
var measurementDao = new MeasurementDao();

var Util = require("./Util")();
var util = new Util();

var SerialPort = require("serialport").SerialPort;
var serialPort = new SerialPort("/dev/ttyAMA0", {
	baudrate : 38400
});

module.exports = function() {
	function Atlas() {
	};

	Atlas.prototype.read = function(probe, paramString) {
		this.probe = probe;
		var self = this;

		var paramStringArr = paramString.split(":");
		var pin0 = parseInt(paramStringArr[0]);
		var pin1 = parseInt(paramStringArr[1]);

		async.parallel([ function(callback) {
			gpio.setup(16, gpio.DIR_OUT, callback);
		}, function(callback) {
			gpio.setup(18, gpio.DIR_OUT, callback);
		} ], function(err, results) {
			console.log('Pins set up');
			self._writePins(pin0, pin1);
		});

	};

	Atlas.prototype._writePins = function(pin0, pin1) {
		var self = this;

		async.serial([ function(callback) {
			gpio.write(16, pin0, function(err) {
				if (err) {
					throw err;
				}
				console.log("Written " + pin0 + " to pin 16");
			});
		}, function(callback) {
			gpio.write(18, pin1, function(err) {
				if (err) {
					throw err;
				}
				console.log("Written " + pin1 + " to pin 18");
			});
		} ], function(err, results) {		
			console.log("Probe chosen.");
			self._readValue(self);	
		});
	};

	Atlas.prototype._readValue = function(self) {
		serialPort.open(function() {
			serialPort.write("\r");
			
			var read = function(lastTempNum){
				var lastTempStr = util.toFixed(lastTempNum, 2);

				serialPort.write("E\r"); // END continuous mode (just in case)
				console.log("Probe temperature set to: "+lastTempStr);
				serialPort.write(lastTempStr + "\r");

				serialPort.on('data', function(data) {
					console.log('data received: ' + data);
					measurementDao.saveMeasurement(self.probe.code, data, self._close);
				});

				serialPort.write("R\r");

				serialPort.drain(function(err) {
					if (err){
						throw err;
					}
				});
			};

			// read last known temperature and read in callback
			measurementDao.getLastMeasurement('TEMP', read);
			
		});
	};

	Atlas.prototype._close = function() {
		async.serial([
		    function(callback){
				gpio.destroy(function() {
					console.log('All pins unexported');
					});
				},
			function(callback){
				serialPort.close(function() {
					console.log('Serial Port closed');
					});
				}
			], function(err, results) {
				process.exit(0);
			}
		);
	};


	return Atlas;
};

