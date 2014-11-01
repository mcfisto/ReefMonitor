/**
 * Params DAO
 */

var sqlite3 = require('sqlite3').verbose(); 
var db = new sqlite3.Database(__base+'db/reefmonitor.db'); 

var Param = require(__base+"lib/model/Param")();

module.exports = function() {
	
	function ParamsDao() {
	};
	
	ParamsDao.prototype.PARAMS = {
		SYSTEM_ID: 'system.id',
		SYSTEM_TICKS: 'system.ticks'
	};
	
	ParamsDao.prototype.readParam = function(key, callback) {
		db.serialize(function() {
			db.get("SELECT code, value, is_system FROM params WHERE key = ?", key, function(err,
					row) {
				if (err){
					throw err;
				}
				var param = new Param();
				_rowMapper(param, row);
				callback(param);
			});
		});
	};
	
	ParamsDao.prototype.saveParam = function(param, callback) {
		db.serialize(function() {
			  var stmt = db.prepare("INSERT INTO params" +
			  		"(code, value, is_system) " +
			  		"VALUES (?, ?, ?)");
			  stmt.run(param.key, param.value, param.isSystem, function(err){
				  if (err){
					  throw err;
				  }
				  callback(param);
			  });
			  stmt.finalize();			  
		});
	};
	
	ParamsDao.prototype.getAndIncreaseTick = function(callback) {
		db.serialize(function() {
			db.get("SELECT value FROM params WHERE key = ?", ParamsDao.prototype.PARAMS.SYSTEM_TICKS, function(err,
					row) {
				if (err){
					throw err;
				}
				var val = JSON.parse(row.value);
				var tick = ++val.integer; 
				db.serialize(function() {
					var stmt = db.prepare("UPDATE params SET value = ? WHERE key = ?");
					stmt.run(JSON.stringify(val), ParamsDao.prototype.PARAMS.SYSTEM_TICKS, function(err) {
						if (err) {
								throw err;
							}
					});
					stmt.finalize();
				});
				callback(tick);
			});
		});
	};
	
	return ParamsDao;
};

var _rowMapper = function(param, row){
	param.key = row.key;
	param.value = JSON.parse(row.value);
	param.isSystem = row.is_system;
};