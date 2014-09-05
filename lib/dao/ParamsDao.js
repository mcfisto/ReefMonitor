/**
 * Params DAO
 */

var sqlite3 = require('sqlite3').verbose(); 
var db = new sqlite3.Database('./db/reefmonitor.db'); 

var Param = require("../model/Param")();

module.exports = function() {
	
	function ParamsDao() {
	};
	
	ParamsDao.prototype.readParam = function(key, callback) {
		db.serialize(function() {
			db.get("SELECT code, value_int, value_text, value_date, is_system FROM params WHERE key = ?", key, function(err,
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
			  		"(code, value_int, value_text, value_date, is_system) " +
			  		"VALUES (?, ?, ?, ?, ??)");
			  stmt.run(param.key, param.valueInt, param.valueText, 
					  param.valueDate, param.isSystem, function(err){
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
			db.get("SELECT value_int FROM params WHERE key = 'system.ticks'", function(err,
					row) {
				if (err){
					throw err;
				}
				var tick = row.value_int + 1;
				db.serialize(function() {
					var stmt = db.prepare("UPDATE params SET value_int = ? WHERE key = 'system.ticks'");
					stmt.run(tick, function(err) {
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
	param.valueText = row.value_text;		
	param.valueInt = row.value_int;
	param.valueDate = row.value_date;
	param.isSystem = row.is_system;
};