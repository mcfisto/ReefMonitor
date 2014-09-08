/**
 * Main scheduled job task (one tick)
 */

global.__base = __dirname+'/../';

var ParamsDao = require(__base+"lib/dao/ParamsDao")();
var paramsDao = new ParamsDao();


var mainJob = function(tick){
	console.log('Tick: '+tick);
	
	// read measurements of all active probes (every 10 minutes)
	if (tick % 10 == 0){
		console.log("Fire!");
	}
	
	// generate alerts
	
	// check probe status - calibration, replacements
};


paramsDao.getAndIncreaseTick(mainJob);