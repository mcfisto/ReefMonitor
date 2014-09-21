/**
 * Probe model
 */

module.exports = function(){
	function Probe(){
		this.name = null;
		this.code = null;
		this.unit = null;
		this.type = null; // MANUAL, AUTO
		this.connectionType = null; // 1Wire, Atlas, I2C
		this.deviceType = null; // PH, ORP, TEMP,... -> odkaz do params		
		this.systemId = null; // 1:0, 1254djfgfy1452 
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
	
	Probe.prototype.CONNECTION_TYPES = {
			ONE_WIRE: '1Wire',
			ATLAS: 'Atlas',
			I2C: 'I2C'
	};
	
	return Probe;
};
