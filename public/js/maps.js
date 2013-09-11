(function() {
    function initialize() {
        var mapOptions = {
            center: new google.maps.LatLng(37.7516, -122.4477),
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    }

    google.maps.event.addDomListener(window, 'load', initialize);
})();