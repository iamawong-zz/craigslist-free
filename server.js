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
    maxAge = 0;
}

app.use(express.static(__dirname + '/public', {maxAge: maxAge}));
app.use(express.compress());
// app.use(express.logger());

app.get('/', function(request, response) {
	var get_craigslist = function(callback) {
		db.get('free', function(err, result) {
			if (err) {
				callback({});
				return;
			}

			if (result) {
				callback(result);
				return;
			}			

			poll.craigslist(callback);
		});
	};

	get_craigslist(function(data) {
		response.send(data);
	});
});

app.listen(3000);
