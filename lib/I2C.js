/**
 * i2c manipulation wrapper
 */

var PythonShell = require('python-shell');

var LogDao = require(__base+"lib/dao/LogDao")();
var logger = new LogDao();


module.exports = function() {
	function I2C() {
		PythonShell.run(__base+"thirdparty/Adafruit_PWM_Driver/Init.py", function (err, result) {
			if (err){
				console.log(err);
			}
		});
	};
	
	I2C.prototype.scan = function(){
		//pwm.scan();
	};
	
	I2C.prototype.setValue = function(channel, value){
		var end = (value * 4095) / 100;
		console.log("i2c value: "+end);
		// pwm.setPWM(channel, 0, end);
	};
	
	return I2C;	
};