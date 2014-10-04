/**
 * Debug Controller
 */

var I2C = require(__base+"lib/I2C")();
var i2c = new I2C();

exports.i2c = function(req, res){
	i2c.scan();
	i2c.setValue(3, 0);
	res.render('debug_i2c', { "title": 'Reef Monitor::i2c DEBUG'});
};