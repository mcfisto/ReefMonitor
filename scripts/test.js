/**
 * Testing script
 */

global.__base = __dirname+'/../';

var Dao = require(__base+"lib/dao/ProbeDao")();
var ParamsDao = require(__base+"lib/dao/ParamsDao")();

var dao = new Dao();
var paramsDao = new ParamsDao();

dao.readProbe('PH1', function(probe){
	console.log(probe.lastValue);
	dao.saveProbe(probe, function(probe){
		console.log(probe);
	});
});

dao.readProbes(function(probes){
	console.log(probes[0].code);
});



paramsDao.getAndIncreaseTick(function(tick){
	console.log(tick);
});

//dao.finalize();