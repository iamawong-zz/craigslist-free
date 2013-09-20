(function() {
    function initialize() {
        var mapOptions = {
            center: new google.maps.LatLng(37.7516, -122.4477),
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    	var getPostings = function(callback) {
    		var postingsArray = $('#distinct .posting').map(function(idx, elem) {
    			var $this = $(this);

    			var title = unescape($this.data('title')),
    				longitude = $this.data('longitude'),
    				latitude = $this.data('latitude'),
    				anchor = $this.data('anchor');

    			$this.remove();

    			return {
					title: title,
					longitude: longitude,
					latitude: latitude,
					anchor: anchor
    			};
    		}).get();

    		callback(postingsArray);
    	};

        var placeOnMap = function(elem) {
        	var latLng = new google.maps.LatLng(elem.latitude, elem.longitude);

        	var marker = new google.maps.Marker({
		    	position: latLng,
		    	map: map,
		    	title: elem.title
			});

            var self = this,
                lastOpenedInfoWindow = null;

			google.maps.event.addListener(marker, 'click', function() {
				$.get("/item", { anchor: elem.anchor }, function(data, status) {
					var title = data.data.title,
						body = data.data.body,
                        link = data.data.link;

                        var infoWindowOptions = {
                            content: '<a href="' + link + '"><h4>' + title + '</h4></a>' + body,
                            disableAutoPan: true,
                            maxWidth: 300
                        };

						var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

						infoWindow.open(map, marker);

                        if (self.lastOpenedInfoWindow) {
                            self.lastOpenedInfoWindow.close();
                        }

                        self.lastOpenedInfoWindow = infoWindow;
				});
			});
        };

        getPostings(function(array) {
        	array.forEach(function(elem) {
        		placeOnMap(elem);
        	});
        });
    }

    google.maps.event.addDomListener(window, 'load', initialize);
})();