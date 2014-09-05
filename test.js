/**
 * Testing script
 */

var Dao = require("./lib/dao/ProbeDao")();
var ParamsDao = require("./lib/dao/ParamsDao")();

var dao = new Dao();
var paramsDao = new ParamsDao();

dao.readProbe('PH1', function(probe){
	console.log(probe.lastValue);
});

dao.readProbes(function(probes){
	console.log(probes[0].code);
});

paramsDao.getAndIncreaseTick(function(tick){
	console.log(tick);
});

dao.finalize();