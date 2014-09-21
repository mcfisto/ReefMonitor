/**
 * 1 Wire reading
 */

global.__base = __dirname+'/../';

// system imports
var fs = require('fs');

// custom imports
var MeasurementDao = require(__base+"lib/dao/MeasurementDao")();
var measurementDao = new MeasurementDao();

var LogDao = require(__base+"lib/dao/LogDao")();
var logger = new LogDao();

module.exports = function() {
	function OneWire() {
	};
	
	OneWire.prototype.read = function(probe){
		fs.readFile('/sys/bus/w1/devices/'+probe.systemId+'/w1_slave', function(err, data){
			if (err) {
				throw err;
			}
			_internal.processData(probe, data);
		});
	};
	
	return OneWire;
};


var _internal = {
		processData: function(probe, data){
			var array = data.toString().split("\n");
			for (i in array) {
				console.log(array[i]);
			}
			if(array[0].indexOf("YES") > -1) {
				var tempStartIndex = array[1].indexOf("t=")+2;
				var tempStr = array[1].substring(tempStartIndex);
				var tempNum = parseFloat(tempStr)/1000;
				measurementDao.saveMeasurement(probe.code, tempNum, function(){
					logger.log("DEBUG", "Temperature read: "+tempNum);
				});
			}
		}
};