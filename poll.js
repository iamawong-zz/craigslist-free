var request = require('request'),
    _       = require('underscore'),
    cheerio = require('cheerio'),
    redis   = require('redis'),
    db      = redis.createClient();

var expire_time = process.env.NODE_ENV == 'production' ? 1800 : 0;

var poll_craigslist = function(callback) {
    var body_extractor = function(idx, elem) {
        var $this     = $(this),
            post_id   = $this.attr('data-pid'),
            latitude  = $this.attr('data-latitude'),
            longitude = $this.attr('data-longitude'),
            anchor    = $this.children('a').attr('href'),
            title     = $this.children('.pl').children('a').text();

        if (latitude === undefined && longitude === undefined) {
            // Need to figure out what to do later if we dont have the longitude and latitude
            // var location = $this.children('.l2').children('.pnr').children('small').text();
            return {};
        }

        return {
            "post_id": post_id,
            "longitude": longitude,
            "latitude": latitude,
            "anchor": anchor,
            "title": title
        };
    };

    var not_empty = function(elem, idx) {
        return !_.isEmpty(elem);
    };

    request('http://sfbay.craigslist.org/sfc/zip/', function(error, response, body) {
        if (error || response.statusCode != 200) {
            callback('', '', '');
        }

        $ = cheerio.load(body);

        var data = $('p.row').map(body_extractor).filter(not_empty);
        db.set('recent', data, expire_time);
    });
};

poll_craigslist();