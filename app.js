
/**
 * Module dependencies.
 */

// built-in modules
var express = require('express');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var compression = require('compression');
var methodOverride = require('method-override');
var serveStatic = require('serve-static');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var csrf = require('csurf');
var errorhandler = require('errorhandler');
var morgan  = require('morgan');
var expressValidator = require('express-validator');

global.__base = __dirname + '/';

var routes = require('./routes');
var routesProbes = require('./routes/probes');
var debug = require('./routes/debug');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
//app.use(favicon(__dirname + '/public/img/favicon.ico'));
morgan({ format: 'dev', immediate: true }); // ex. logger
app.use(compression());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
//app.use(express.limit('32mb'));
app.use(serveStatic(path.join(__dirname, 'public')));


// session support
app.use(cookieParser('KuukL9*#85zR$!qW'));
app.use(session({secret: 'HjN8*&&ahj[::9io'}));

// CSRF protection middleware
app.use(csrf());
app.use(function(req, res, next) {
	res.locals.csrftoken = req.csrfToken();
	next();
});

// development only
if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler());
}

app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});

app.use(express.Router());

app.get('/', routes.index);
app.get('/probes', routesProbes.list);
app.get('/probes/new-manual', routesProbes.newManual);
app.get('/probes/new-auto', routesProbes.newAuto);
app.post('/probes/save', routesProbes.save);
app.get('/debug/i2c', debug.i2c);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
