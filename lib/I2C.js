/**
 * i2c manipulation wrapper
 */

PwmDriver = require('adafruit-i2c-pwm-driver');
pwm = new PwmDriver(0x40, '/dev/i2c-1');

var LogDao = require(__base+"lib/dao/LogDao")();
var logger = new LogDao();


module.exports = function() {
	function I2C() {
		pwm.setPWMFreq(100);
	};
	
	I2C.prototype.scan = function(){
		pwm.scan();
	};
	
	I2C.prototype.setValue = function(channel, value){
		var end = (value * 4095) / 100;
		pwm.setPWM(channel, 0, end);
	};
	
	return I2C;	
};