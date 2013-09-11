var express = require('express'),
	poll    = require('./poll'),
	redis   = require('redis'),
	db      = redis.createClient();

var app = express();

if (process.env.NODE_ENV == 'production') {
    console.log("Initializing production");
    maxAge = 604800000;
} else {
    console.log("Initializing development");
    maxAge = 10;
}

app.use(express.static(__dirname + '/public', {maxAge: maxAge}));
app.use(express.compress());
// app.use(express.logger());
app.engine('.html', require('ejs').__express);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
	var get_craigslist = function(callback) {
		db.get('free', function(err, result) {
			if (err) {
				callback({});
				return;
			}

			if (result) {
				console.log("cache hit");
				callback(result);
				return;
			}

			poll.craigslist(callback);
		});
	};

	get_craigslist(function(data) {
		var object = JSON.parse(data);
		console.log(object);
		res.render('index.html', {json: data, object: object});
	});
});

app.listen(3000);
