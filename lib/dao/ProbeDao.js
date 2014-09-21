/**
 * Probe DAO
 */

var sqlite3 = require('sqlite3').verbose(); 
var db = new sqlite3.Database(__base+'db/reefmonitor.db'); 
var Probe = require(__base+"lib/model/Probe")();
var MeasurementDao = require(__base+"lib/dao/MeasurementDao")();



module.exports = function() {

	function ProbeDao() {
	};

	ProbeDao.prototype.saveProbe = function(probe, callback) {
		_internal.getNewCode(probe.type, function(newCode){
			console.log("New code: "+newCode);
		});
		db.serialize(function() {
			var stmt = null;
			if (probe.code == null) {
				probe.code = newCode;
				stmt = db.prepare("INSERT INTO probes"
						+ "(name, code, type, unit, system_id, min, min_w, max, max_w, "
						+ "is_in_service, is_system, last_calibration_date, last_replacement_date) "
						+ "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
			} else {
				stmt = db.prepare("UPDATE probes SET"
						+ " name = ?, type = ?, unit = ?, system_id = ?, min = ?, min_w = ?, max = ?, max_w = ?, "
						+ " is_in_service = ?, is_system = ?, last_calibration_date = ?, last_replacement_date = ? "
						+ " WHERE code = ?");
			}
			stmt.run(probe.name, probe.type, probe.unit,
							probe.systemId, probe.min, probe.minW, probe.max,
							probe.maxW, probe.isInService, probe.isSystem,
							probe.lastCalibrationDate,
							probe.lastReplacementDate, function(err) {
								if (err) {
									throw err;
								}
								callback(probe);
							});
			stmt.finalize();
			});
	};

	ProbeDao.prototype.readProbe = function(probeId, callback) {
		db.serialize(function() {
			db.get(_internal.SQL_BASE + "WHERE code = ?", probeId, function(err, row) {
				if (err) {
					throw err;
				}
				var probe = new Probe();
				_internal.rowMapper(probe, row);
				callback(probe);
			});
		});
	};

	ProbeDao.prototype.readProbes = function(withLastValue, callback) {
		var probes = [];
		db.serialize(function() {
			var sql = withLastValue ? _internal.SQL_BASE_WITH_LAST_VALUE : _internal.SQL_BASE;
			db.each(sql, function(err, row) {
				if (err) {
					throw err;
				}
				var probe = new Probe();
				_internal.rowMapper(probe, row);
				probes.push(probe);
			}, function(err, num) {
				if (err) {
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

var _internal = {
	rowMapper: function(probe, row){
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
	},
	
	getNewCode: function(codeBase, callback){
		db.serialize(function() {
			var baseLength = codeBase.length;
			db.get("SELECT CAST(substr(code, "+(baseLength+1)+") AS integer) + 1 AS new_seq FROM probes WHERE code LIKE ? ORDER BY new_seq DESC LIMIT 1", codeBase+"%", function(err, row) {
				if (err) {
					throw err;
				}
				var newCode = codeBase + row.new_seq;
				callback(newCode);
			});
		});
	},

	SQL_BASE: "SELECT name, code, type, unit, system_id, min, max, min_w, max_w, is_in_service, is_system, last_calibration_date, last_replacement_date "
		+ " FROM probes ",
		
	SQL_BASE_WITH_LAST_VALUE: "SELECT name, code, type, unit, system_id, min, max, min_w, max_w, is_in_service, is_system, last_calibration_date, last_replacement_date "
		+", ("
		+ " SELECT value FROM measurements WHERE probe_code = code "
			+ "AND stamp = (SELECT MAX(m.stamp) FROM measurements m "
			+ "WHERE m.probe_code = code)"
			+ " ) as last_value"
			+ " FROM probes "
};