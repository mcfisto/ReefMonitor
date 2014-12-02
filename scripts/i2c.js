/**
 * New node file
 */

global.__base = __dirname + '/../';

var I2C = require(__base + "lib/I2C")();
var i2c = new I2C();

i2c.setValue(11, 100, function() {
	console.log("Done");
});