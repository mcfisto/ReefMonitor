/**
 * Debug Controller
 */

var I2C = require(__base+"lib/I2C")();
var i2c = new I2C();

exports.i2c = function(req, res){
	res.render('debug_i2c', { "title": 'Reef Monitor::i2c DEBUG'});
};


exports.i2cSet = function(req, res){
	console.log("Put value: "+req.params.value);
	console.log("Channel: "+req.params.channel);
	req.sanitize('channel').toInt();
	req.sanitize('value').toInt();
	i2c.setValue(req.params.channel, req.params.value, function(){
		res.json({ message: 'OK' });
	});
};