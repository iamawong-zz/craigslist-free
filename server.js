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

			poll.listings(callback);
		});
	};

	get_craigslist(function(data) {
		var object = JSON.parse(data);
		console.log(object);
		res.render('index.html', {object: object});
	});
});

app.get('/item', function(req, res) {
	var request_anchor = req.query.anchor;

	var get_item = function(cb) {
		db.get(request_anchor, function(err, result) {
			if (err) {
				cb({});
				return;
			}

			if (result) {
				console.log('cache hit for item');
				cb(result);
				return;
			}

			poll.item(request_anchor, cb);
		});
	}

	get_item(function(data) {
		data = JSON.parse(data);

		res.writeHead(200, {'Content-Type': 'application/json'});
		res.write(JSON.stringify({data: data}));
		res.end();
	});
});

app.listen(3000);
