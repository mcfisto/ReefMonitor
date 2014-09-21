/**
 * Param Model
 */

module.exports = function(){
	function Param() {
		this.key = null;
		this.valueInt = null;
		this.valueText = null;
		this.valueDate = null;
		this.isSystem = null;
	}
	return Param;
};