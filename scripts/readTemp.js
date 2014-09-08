/**
 * Reads Temperature from 1-Wire probe and saves it into DB
 */
// system imports
var fs = require('fs');

// my imports
var Dao = require("./lib/Dao")();
var Util = require("./lib/Util")();

// declarations
var dao = new Dao();
var util = new Util();

if (util.debug()){
	dao.recreateTables();
}

var probeId = process.argv.slice(2)[0];
console.log('Reading probe: ', probeId);

dao.readProbe(probeId, function(probe){
	fs.readFile('/sys/bus/w1/devices/'+probe.systemId+'/w1_slave', function(err, data){
		if (err) {
			throw err;
		}
		processData(probe, data);
	});
});




// **********************************
// functions
// **********************************
var processData = function(probe, data) {	
	var array = data.toString().split("\n");
	for (i in array) {
		console.log(array[i]);
	}
	if(array[0].indexOf("YES") > -1) {
		var tempStartIndex = array[1].indexOf("t=")+2;
		var tempStr = array[1].substring(tempStartIndex);
		var tempNum = parseFloat(tempStr)/1000;
		console.log("Temp: "+tempNum);
		dao.saveMeasurement(probe, tempNum, function(){
			if (util.debug()){
				dao.dumpTables();
			}
			dao.finalize();
		});
	}
};
