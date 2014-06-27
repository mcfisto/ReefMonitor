
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
//var user = require('./routes/user');
//var webApp = require('./routes/app');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.methodOverride());
app.use(express.bodyParser({uploadDir: '/tmp'}));
app.use(express.limit('32mb'));
app.use(express.static(path.join(__dirname, 'public')));


// session support
app.use(express.cookieParser());
app.use(express.session({
  secret: 'HjN8*&&ahj[::9io'
}));

// CSRF protection middleware
app.use(express.csrf());
app.configure(function() {
	app.use(function(req, res, next) {
		res.locals.token = req.csrfToken();
		next();
	});
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.use(app.router);

app.get('/', routes.index);
//app.get('/app/new', webApp.startOrder);
//app.post('/app/step1Process', webApp.step1Process);
//app.get('/app/step2Prepare', webApp.step2Prepare);
//app.get('/app/text', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
