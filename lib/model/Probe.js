/**
 * Probe model
 */

module.exports = function(){
	function Probe(){
		this.name = null;
		this.code = null;
		this.type = null; // MANUAL, 1Wire, Atlas, I2C
		this.unit = null;
		this.systemId = null;
		this.min = null;
		this.max = null;
		this.minW = null;
		this.maxW = null;
		this.lastValue = null;
		this.isInService = null;
		this.isSystem = null;
		this.lastCalibrationDate = null;
		this.lastReplacementDate = null;
	};
	
	return Probe;
};
