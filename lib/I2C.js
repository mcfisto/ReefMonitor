/**
 * i2c manipulation wrapper
 */

var PythonShell = require('python-shell');

var LogDao = require(__base+"lib/dao/LogDao")();
var logger = new LogDao();


module.exports = function() {
	function I2C() {		
	};
	
	I2C.prototype.scan = function(){
		//pwm.scan();
	};
	
	I2C.prototype.setValue = function(channel, value){
		var end = (value * 4095) / 100;
		console.log("i2c value: "+end);
		var options = {
				  mode: 'text',
				  pythonPath: '/usr/bin/python',
				  pythonOptions: ['-u'],
				  scriptPath: __base+"thirdparty/Adafruit_PWM_Driver",
				  args: [channel, end]
				};
		PythonShell.run("SetValue.py", options, function (err, result) {
			if (err){
				console.log(err);
			}
		});
	};
	
	return I2C;	
};