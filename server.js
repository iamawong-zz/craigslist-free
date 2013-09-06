var express = require('express');

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

app.listen(3000);