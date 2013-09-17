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
        };

        getPostings(function(array) {
        	array.forEach(function(elem) {
        		placeOnMap(elem);
        	});
        });
    }

    google.maps.event.addDomListener(window, 'load', initialize);
})();