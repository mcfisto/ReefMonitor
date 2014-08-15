/**
 * Probe model
 */

module.exports = function(){
	function Probe(){
		this.name = null;
		this.code = null;
		this.type = null; // AUTO, MANUAL
		this.unit = null;
		this.systemId = null;
		this.min = null;
		this.max = null;
		this.minW = null;
		this.maxW = null;
		this.lastValue = null;
		this.isInService = null;
		this.isSystem = null;
		this.persisted = false;
	};
	
	return Probe;
};
