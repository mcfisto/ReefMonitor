/**
 * New node file
 */

var sqlite3 = require('sqlite3').verbose(); 
var db = new sqlite3.Database(__base+'db/reefmonitor.db'); 

module.exports = function() {
	
	function MeasurementDao() {
		this.running = false;
	};
	

	
	MeasurementDao.prototype.saveMeasurement = function(probeCode, value, callback) {
		db.serialize(function() {
			db.run("INSERT INTO measurements(probe_code, stamp, value) VALUES" +
					" (?, datetime('now', 'localtime'), ?)", probeCode, value, function(err){
				if (err) {
					throw err;
				}
				callback();
			});
		});
	};
	
	MeasurementDao.prototype.getLastMeasurement = function(probeId, callback) {
		db.serialize(function() {
			db.get(SQL_LAST_VALUE, probeId, probeId, function(err, row) {
				if (err){
					throw err;
				}
				callback(row.value);
			});
		});
	};
	
	MeasurementDao.prototype.finalize = function() {
		db.close();
	};
	
	return MeasurementDao;
};

var SQL_LAST_VALUE = "SELECT value FROM measurements WHERE probe_code = ? "
	+ "AND stamp = (SELECT MAX(m.stamp) FROM measurements m "
	+ "WHERE m.probe_code = ?)";