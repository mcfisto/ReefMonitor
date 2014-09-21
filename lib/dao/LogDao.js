/**
 * Logging facility
 */

var sqlite3 = require('sqlite3').verbose(); 
var db = new sqlite3.Database(__base+'db/reefmonitor.db');

var Log = require(__base+"lib/model/Log")();

module.exports = function() {
	
	function LogDao() {
	};
	
	LogDao.prototype.log = function(category, value, callback) {
		db.serialize(function() {
			db.run("INSERT INTO logs(stamp, category, value) VALUES" +
					" (datetime('now', 'localtime'), ?, ?)", category, value, function(err){
				if (err) {
					throw err;
				}				
				if (callback){
					callback();
				}
			});
		});
	};
	
	LogDao.prototype.readLogs = function(count, callback) {
		var logs = [];
		db.serialize(function() {
			var sql = "SELECT stamp, category, value FROM logs ORDER BY stamp DESC";
			if (count){
				sql += " LIMIT " + count;
			}
			db.each(sql, function(err, row) {
				if (err) {
					throw err;
				}
				var log = new Log();
				_internal.rowMapper(log, row);
				logs.push(log);
			}, function(err, num) {
				if (err) {
					throw err;
				}
				callback(logs);
			});
		});
	};
	
	return LogDao;
};

var _internal = {
		rowMapper: function(log, row){
			log.timestamp = row.stamp;
			log.category = row.category;		
			log.value = row.value;
		}
};