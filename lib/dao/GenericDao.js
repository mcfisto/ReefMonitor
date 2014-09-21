/**
 * DB tools
 */

var sqlite3 = require('sqlite3').verbose(); 
var db = new sqlite3.Database(__base+'db/reefmonitor.db'); 

module.exports = function() {
	
	function GenericDao() {
	};	

	
	GenericDao.prototype.recreateTables = function() {
		if (true){
			db.serialize(function() {
				db.run("DROP TABLE IF EXISTS probes");
				db.run("CREATE TABLE probes ("
						+ "name TEXT,"
						+ "code TEXT PRIMARY KEY,"
						+ "type TEXT,"
						+ "connection_type TEXT,"
						+ "unit TEXT,"
						+ "system_id TEXT UNIQUE,"
						+ "min REAL,"
						+ "min_w REAL,"
						+ "max REAL,"
						+ "max_w REAL,"
						+ "is_in_service BOOL,"
						+ "is_system BOOL,"
						+ "last_calibration_date DATETIME,"
						+ "last_replacement_date DATETIME"
						+ ")");
				var stmt = db.prepare("INSERT INTO probes(name, code, type, connection_type, unit, system_id, min_w, min, max_w, max, is_in_service, is_system) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
				stmt.run("Teplota Sump", "TEMP1", "AUTO", "1Wire", "°C", "1W|28-0000054e5ffe", 23, 24.5, 30, 29, true, false);
				stmt.finalize();
				
				stmt = db.prepare("INSERT INTO probes(name, code, type, connection_type, unit, system_id, min_w, min, max_w, max, is_in_service, is_system) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
				stmt.run("pH Hlavni", "PH1", "AUTO", "Atlas", "", "Atlas|0:0", 7, 8, 10, 9, true, false);
				stmt.finalize();
				
				db.run("DROP TABLE IF EXISTS measurements");
				db.run("CREATE TABLE measurements ("
						+ "probe_code TEXT,"
						+ "stamp DATETIME,"
						+ "value REAL,"
						+ "FOREIGN KEY(probe_code) REFERENCES probes(code)"
						+ ")");
				
				stmt = db.prepare("INSERT INTO measurements(probe_code, value, stamp) VALUES (?, ?, ?)");
				stmt.run("TEMP1", 25.6789, new Date());
				stmt.finalize();
				
				stmt = db.prepare("INSERT INTO measurements(probe_code, value, stamp) VALUES (?, ?, ?)");
				stmt.run("PH1", 7.56, new Date());
				stmt.finalize();
				
				db.run("DROP TABLE IF EXISTS params");
				db.run("CREATE TABLE params ("
						+ "key TEXT PRIMARY KEY,"
						+ "value_text TEXT,"
						+ "value_int INTEGER,"
						+ "value_date DATETIME,"
						+ "is_system BOOL"
						+ ")");
				
				stmt = db.prepare("INSERT INTO params(key, value_int, is_system) VALUES (?, ?, ?)");
				stmt.run("system.ticks", 0, true);
				stmt.finalize();
				
				db.run("DROP TABLE IF EXISTS logs");
				db.run("CREATE TABLE logs ("
						+ "stamp DATETIME,"
						+ "category TEXT,"
						+ "value TEXT"
						+ ")");
			});
		}
	};	


	GenericDao.prototype.dumpTables = function() {
		db.serialize(function() {
			db.each("SELECT probe_code, stamp, value FROM measurements", function(err, row) {
		      console.log(row.probe_code + ": " + row.stamp + " | " +row.value);
			});
			db.each("SELECT key, value_int FROM params", function(err, row) {
			      console.log(row.key + ": " + row.value_int);
				});
		});
	};
	
	GenericDao.prototype.finalize = function() {
		db.close();
	};
	
	return GenericDao;
};