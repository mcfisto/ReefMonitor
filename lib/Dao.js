/**
 * DAO
 */ var sqlite3 = require('sqlite3').verbose(); var db = new sqlite3.Database('/opt/reefmonitor/db/reefmonitor.db'); var Probe = require("./Probe")(); 
module.exports = function() {
	function Dao() {
	};
	Dao.prototype.recreateTables = function() {
		db.serialize(function() {
			db.run("DROP TABLE IF EXISTS probes");
			db.run("CREATE TABLE probes ("
					+ "code TEXT PRIMARY KEY,"
					+ "system_id TEXT,"
					+ "min_e REAL,"
					+ "min_w REAL,"
					+ "max_e REAL,"
					+ "max_w REAL"
					+ ")");
			var stmt = db.prepare("INSERT INTO probes(code, system_id) VALUES (?, ?)");
			stmt.run("TEMP", "1W|28-0000054e5ffe");
			stmt.finalize();
			
			stmt = db.prepare("INSERT INTO probes(code, system_id) VALUES (?, ?)");
			stmt.run("PH", "Atlas|0:0");
			stmt.finalize();
			
			db.run("DROP TABLE IF EXISTS measurements");
			db.run("CREATE TABLE measurements ("
					+ "probe_code TEXT PRIMARY KEY,"
					+ "stamp DATETIME,"
					+ "value REAL,"
					+ "FOREIGN KEY(probe_code) REFERENCES probes(code)"
					+ ")");
			
			stmt = db.prepare("INSERT INTO measurements(probe_code, value, stamp) VALUES (?, ?, ?)");
			stmt.run("TEMP", 25.6789, new Date());
			stmt.finalize();
		});
	};
	
	
	Dao.prototype.dumpTables = function() {
		db.serialize(function() {
			db.each("SELECT probe_code, stamp, value FROM measurements", function(err, row) {
		      console.log(row.probe_code + ": " + row.stamp + " | " +row.value);
			});
		});
	};
	
	Dao.prototype.getLastMeasurment = function(probeId, callback) {
		db.serialize(function() {
			db.get("SELECT value FROM measurements WHERE probe_code = '"+probeId+"' " +
					"AND stamp = (SELECT MAX(stamp) FROM measurements " +
					"WHERE probe_code = '"+probeId+"')", function(err, row) {
		      callback(row.value);
			});
		});
	};
	Dao.prototype.readProbe = function(probeId, callback) {
		db.serialize(function() {
			db.get("SELECT code, system_id FROM probes WHERE code = ?", probeId, function(err,
					row) {
				console.log(row.code + ": " + row.system_id);
				var probe = new Probe();
				probe.code = row.code;
				probe.systemId = row.system_id;
				callback(probe);
			});
		});
	};
	
	Dao.prototype.saveMeasurement = function(probe, value, callback) {
		db.serialize(function() {
			db.run("INSERT INTO measurements(probe_code, stamp, value) VALUES" +
					" (?, datetime('now', 'localtime'), ?)", probe.code, value, function(err){
				if (err) {
					throw err;
				}
				callback();
			});
		});
	};
	Dao.prototype.finalize = function() {
		// TODO nefunguje - muze to zavrit pred provedenim prikazu!!!
		db.close();
	};
	return Dao;
};
