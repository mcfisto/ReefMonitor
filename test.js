/**
 * Testing script
 */

var Dao = require("./lib/dao/ProbeDao")();

var dao = new Dao();

dao.readProbe('PH1', function(probe){
	console.log(probe.lastValue);
});

dao.readProbes(function(probes){
	console.log(probes[0].code);
});

dao.finalize();