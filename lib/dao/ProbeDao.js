/**
 * Probe DAO
 */

var sqlite3 = require('sqlite3').verbose(); 
var db = new sqlite3.Database('./db/reefmonitor.db'); 
var Probe = require("../model/Probe")();
var MeasurementDao = require("./MeasurementDao")();



module.exports = function() {
	
	function ProbeDao() {
	};
	
	ProbeDao.prototype.saveProbe = function(probe, callback) {
		db.serialize(function() {
			  var stmt = db.prepare("INSERT INTO probes" +
			  		"(name, code, type, unit, system_id, min, min_w, max, max_w, " +
			  		"is_in_service, is_system, last_calibration_date, last_replacement_date) " +
			  		"VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
			  stmt.run(probe.name, probe.type, probe.unit, probe.systemId, probe.min,
					  probe.minW, probe.max, probe.maxW, probe.isInService, probe.isSystem, 
					  probe.lastCalibrationDate, probe.lastReplacementDate, function(err){
				  if (err){
					  throw err;
				  }
				  callback(probe);
			  });
			  stmt.finalize();
		});
	};
	
	ProbeDao.prototype.readProbe = function(probeId, callback) {
		db.serialize(function() {
			db.get(SQL_BASE + "WHERE code = ?", probeId, function(err,
					row) {
				if (err){
					throw err;
				}
				var probe = new Probe();
				_rowMapper(probe, row);
				callback(probe);
				//_addLastValue(probe, callback);
			});
		});
	};
	
	ProbeDao.prototype.readProbes = function(callback) {
		var probes = [];
		db.serialize(function() {
			db.each(SQL_BASE_WITH_LAST_VALUE, function(err, row) {
				if (err){
					throw err;
				}
				var probe = new Probe();
				_rowMapper(probe, row);
				probes.push(probe);
			}, function(err, num){
				if (err){
					throw err;
				}
				callback(probes);
			});
		});
	};
	
	ProbeDao.prototype.finalize = function() {
		db.close();
	};
	
	return ProbeDao;
};



var _rowMapper = function(probe, row){
	probe.name = row.name;
	probe.code = row.code;		
	probe.type = row.type;
	probe.unit = row.unit;
	probe.systemId = row.system_id;
	probe.min = row.min;
	probe.max = row.max;
	probe.minW = row.min_w;
	probe.maxW = row.max_w;
	probe.isInService = row.is_in_service;
	probe.isSystem = row.is_system;
	probe.lastReplacementDate = row.last_replacement_date;
	probe.lastCalibrationDate = row.last_calibration_date;
	probe.lastValue = row.last_value;
};

var SQL_BASE = "SELECT name, code, type, unit, system_id, min, max, min_w, max_w, is_in_service, is_system, last_calibration_date, last_replacement_date "
	+ " FROM probes ";

var SQL_BASE_WITH_LAST_VALUE = "SELECT name, code, type, unit, system_id, min, max, min_w, max_w, is_in_service, is_system, last_calibration_date, last_replacement_date "
	+", ("
	+ " SELECT value FROM measurements WHERE probe_code = code "
			+ "AND stamp = (SELECT MAX(m.stamp) FROM measurements m "
			+ "WHERE m.probe_code = code)"
	+ " ) as last_value"
	+ " FROM probes ";
