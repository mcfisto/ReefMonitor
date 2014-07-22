
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


var routes = require('./routes');
var routesProbes = require('./routes/probes');
//var webApp = require('./routes/app');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
//app.use(favicon(__dirname + '/public/img/favicon.ico'));
morgan({ format: 'dev', immediate: true }); // ex. logger
app.use(compression());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.limit('32mb'));
app.use(serveStatic(path.join(__dirname, 'public')));


// session support
app.use(cookieParser('KuukL9*#85zR$!qW'));
app.use(session({secret: 'HjN8*&&ahj[::9io'}));

// CSRF protection middleware
app.use(csrf());
/*app.configure(function() {
	app.use(function(req, res, next) {
		res.locals.token = req.csrfToken();
		next();
	});
}); //*/

// development only
if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler());
}


app.use(express.Router());

app.get('/', routes.index);
app.get('/probes', routesProbes.list);
//app.get('/app/new', webApp.startOrder);
//app.post('/app/step1Process', webApp.step1Process);
//app.get('/app/step2Prepare', webApp.step2Prepare);
//app.get('/app/text', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
