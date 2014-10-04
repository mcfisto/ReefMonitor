/**
 * i2c manipulation wrapper
 */

PwmDriver = require('adafruit-i2c-pwm');
pwm = new PwmDriver(0x40, '/dev/i2c-1');

var LogDao = require(__base+"lib/dao/LogDao")();
var logger = new LogDao();


module.exports = function() {
	function I2C() {
	};
	
	I2C.prototype.scan = function(){
		pwm.scan();
	};
	
	return I2C;	
};