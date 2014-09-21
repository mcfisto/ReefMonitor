/**
 * Log model
 */


module.exports = function(){
	function Log(){
		this.timestamp = null;
		this.category = null;
		this.value = null;
	}
	
	Log.prototype.CATEGORIES = {
			ERROR: 'ERROR',
			WARN: 'WARN',
			INFO: 'INFO',
			DEBUG: 'DEBUG'
	};
	
	return Log;
};