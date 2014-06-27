/**
 * Utilities
 */

module.exports = function(){
	function Util(){
	};
	
	Util.prototype.debug = function(){
		return true;
	};
	
	Util.prototype.toFixed = function(value, precision) {
	    var power = Math.pow(10, precision || 0);
	    return String(Math.round(value * power) / power);
	};
	
	return Util;
};
