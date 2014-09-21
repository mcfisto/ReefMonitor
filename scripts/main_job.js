/**
 * Main scheduled job task (one tick)
 */

global.__base = __dirname+'/../';

var ParamsDao = require(__base+"lib/dao/ParamsDao")();
var paramsDao = new ParamsDao();

var ProbeDao = require(__base+"lib/dao/ProbeDao")();
var probeDao = new ProbeDao();

var OneWire = require(__base+"lib/OneWire")();
var oneWire = new OneWire();

var Atlas = require(__base+"lib/Atlas")();
var atlas = new Atlas();


var mainJob = function(tick){
	console.log('Tick: '+tick);
	
	// read measurements of all active probes (every 10 minutes)
	if (tick % 10 == 0){
		probeDao.readProbes(false, function(probes){
			for (probe in probes){
				switch (probe.connectionType){
					case probe.CONNECTION_TYPES.ONE_WIRE:
						oneWire.read(probe);
						break;
					case probe.CONNECTION_TYPES.ATLAS:
						atlas.read(probe);
						break;
				}
				
			}
		});
	}
	
	// generate alerts
	
	// check probe status - calibration, replacements
};


paramsDao.getAndIncreaseTick(mainJob); //TODO transaction?