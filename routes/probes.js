/*
 * Probes pages.
 */
var ProbeDao = require("../lib/dao/ProbeDao")();
var probeDao = new ProbeDao();

exports.list = function(req, res){
	probeDao.readProbes(function(probes){
		res.render('probes', { "title": 'Reef Monitor', "probes": probes});
		// probeDao.finalize(); TODO
	});
  
};