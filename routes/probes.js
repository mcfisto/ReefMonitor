/*
 * Probes pages.
 */
var ProbeDao = require("../lib/dao/ProbeDao")();
var probeDao = new ProbeDao();

var Probe = require("../lib/model/Probe")();

exports.list = function(req, res){
	probeDao.readProbes(function(probes){
		res.render('probes', { "title": 'Reef Monitor', "probes": probes});
		// probeDao.finalize(); TODO
	});
};

exports.newManual = function(req, res){	
	res.render('probe-manual', { "title": 'Reef Monitor :: Nový typ ručního měření'});
};

exports.save = function(req, res){
	req.assert('frmName', 'Název je povinný.').notEmpty();
	req.assert('frmUnit', 'Jednotka je povinný.').notEmpty();
	req.assert('frmMinVal', 'Minimum OK je povinné.').notEmpty();
	req.assert('frmMaxVal', 'Maximum OK je povinné.').notEmpty();
	req.assert('frmMinWVal', 'Minimum varování je povinné.').notEmpty();
	req.assert('frmMaxWVal', 'Maximum varování je povinné.').notEmpty();
	req.assert('frmMinVal', 'Minimum OK musí být číslo.').isFloat();

	var errors = req.validationErrors();		

	// new instance
	var probe = new Probe();

	// write values
	res.locals.frmName = probe.name = req.param('frmName');
	res.locals.frmUnit = probe.unit = req.param('frmUnit');
	res.locals.frmMinVal = probe.min = req.param('frmMinVal');
	res.locals.frmMaxVal = probe.max = req.param('frmMaxVal');
	res.locals.frmMinWVal = probe.minW = req.param('frmMinWVal');
	res.locals.frmMaxWVal = probe.maxW = req.param('frmMaxWVal');		

	console.log(probe);
	
	if (errors){
		// print errors
		console.log(errors);
		exports.newManual(req, res);
	} else {			
		probe.isInService = 1;
		probe.isSystem = 0;
		probe.type = 'MANUAL';
		// save
		console.log(probe);
		res.redirect('/probes');
	}
};

exports.newAuto = function(req, res){
	probeDao.readProbes(function(probes){
		res.render('probe-auto', { "title": 'Reef Monitor', "probes": probes});
		// probeDao.finalize(); TODO
	});
  
};