/**
 * Reads from probe and saves it into DB
 */
// system imports


// my imports
var Dao = require("./lib/Dao")();
var Util = require("./lib/Util")();
var Atlas = require("./lib/Atlas")();

// declarations
var dao = new Dao();
var util = new Util();

if (util.debug()){
	dao.recreateTables();
}

var probeId = process.argv.slice(2)[0];
console.log('Reading probe: ', probeId);

dao.readProbe(probeId, function(probe){
	var probeSystemId = probe.systemId;
	var probeSystemIdArr = probeSystemId.split("|");
	switch (probeSystemIdArr[0]){
		case "1W":
			console.log("Reading 1-Wire...");
			break;
		case "Atlas":
			console.log("Reading Atlas...");			
			new Atlas().read(probe, probeSystemIdArr[1]);
			break;
	};
});
