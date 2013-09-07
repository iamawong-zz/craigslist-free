var request = require('request'),
    _       = require('underscore'),
    cheerio = require('cheerio');

var poll_craigslist = function(callback) {
    request('http://sfbay.craigslist.org/sfc/zip/', function(error, response, body) {
        if (error || response.statusCode != 200) {
            callback('', '', '');
        }

        $ = cheerio.load(body);

        var data = $('p.row')
            .map(body_extractor)
            .filter(function(elem, idx) {
                return !_.isEmpty(elem);
            });
    });
};

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

poll_craigslist();