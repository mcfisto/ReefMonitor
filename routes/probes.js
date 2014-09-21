/*
 * Probes pages.
 */
var ProbeDao = require(__base+"lib/dao/ProbeDao")();
var probeDao = new ProbeDao();

var Probe = require(__base+"lib/model/Probe")();

exports.list = function(req, res){
	probeDao.readProbes(true, function(probes){
		res.render('probes', { "title": 'Reef Monitor', "probes": probes});
		// probeDao.finalize(); TODO
	});
};

exports.newManual = function(req, res){	
	res.render('probe', { "title": 'Reef Monitor :: Nový typ ručního měření'
		, "frmType": 'MANUAL'});
};

exports.save = function(req, res){
	// cancel???
	
	req.assert('frmName', 'Název je povinný.').notEmpty();
	req.assert('frmUnit', 'Jednotka je povinná.').notEmpty();
	req.assert('frmMinVal', 'Minimum OK musí být číslo.').isFloat();
	req.assert('frmMaxVal', 'Maximum OK musí být číslo.').isFloat();
	req.assert('frmMinWVal', 'Minimum varování musí být číslo.').isFloat();
	req.assert('frmMaxWVal', 'Maximum varování musí být číslo.').isFloat();

	var errors = req.validationErrors();		

	// new instance
	var probe = new Probe();

	// write values
	res.locals.frmName = probe.name = req.param('frmName');
	res.locals.frmType = probe.type = req.param('frmType');
	res.locals.frmCode = probe.code = req.param('frmCode');
	res.locals.frmUnit = probe.unit = req.param('frmUnit');
	res.locals.frmMinVal = probe.min = req.param('frmMinVal');
	res.locals.frmMaxVal = probe.max = req.param('frmMaxVal');
	res.locals.frmMinWVal = probe.minW = req.param('frmMinWVal');
	res.locals.frmMaxWVal = probe.maxW = req.param('frmMaxWVal');		

	console.log(probe);
	
	if (errors){
		// print errors
		console.log(errors);
		res.locals.errors = errors;
		exports.newManual(req, res);
	} else {			
		probe.isInService = 1;
		probe.isSystem = 0;
		
		// convert
		req.sanitize('frmMinVal').toFloat();
		req.sanitize('frmMaxVal').toFloat();
		req.sanitize('frmMinWVal').toFloat();
		req.sanitize('frmMaxWVal').toFloat();
		
		// write values
		probe.min = req.param('frmMinVal');
		probe.max = req.param('frmMaxVal');
		probe.minW = req.param('frmMinWVal');
		probe.maxW = req.param('frmMaxWVal');
		
		// save
		console.log(probe);
		probeDao.saveProbe(probe, function(probe){
			res.redirect('/probes');
		});		
	}
};

exports.newAuto = function(req, res){
	probeDao.readProbes(function(probes){
		res.render('probe', { "title": 'Reef Monitor :: Nové elektronické čidlo'
			, "frmType": 'AUTO'});
		// type: 1Wire, Atlas
		// probeDao.finalize(); TODO
	});
  
};