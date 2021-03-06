/**
 * i2c manipulation wrapper
 */

var PWM = require(__base+"thirdparty/adafruit-pca9685/adafruit-pca9685");
// TODO udelat mapu dle adresy!!!
var pwm = new PWM({"freq": "500", "address": "0x52"});

var LogDao = require(__base+"lib/dao/LogDao")();
var logger = new LogDao();


module.exports = function() {
	function I2C() {
	};
	
	I2C.prototype.scan = function(){
		//pwm.scan();
	};
	
	I2C.prototype.setValue = function(channel, value, callback){
		var end = (value * 4095) / 100;
		end = Math.floor(end);
		console.log("i2c channel: "+channel+" value: "+end);
		pwm.setPwm(channel, 0, end);
		callback();
		
		/*var options = {
				  pythonPath: '/usr/bin/python',
				  scriptPath: __base+"thirdparty/Adafruit_PWM_Driver",
				  args: [channel, end]
				};
		PythonShell.run("SetValue.py", options, function(err){
			if (err){
				console.log(err.stack);
			}
			
		});// */
	};
	
	return I2C;	
};