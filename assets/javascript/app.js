var config = {
    apiKey: "AIzaSyD0xbg3cXkxVFnUs6qdaI6jCwHMj_IYGBA",
    authDomain: "project-1-195cf.firebaseapp.com",
    databaseURL: "https://project-1-195cf.firebaseio.com",
    projectId: "project-1-195cf",
    storageBucket: "project-1-195cf.appspot.com",
    messagingSenderId: "830759395184"
  };
firebase.initializeApp(config);
var database = firebase.database();

//database test
var map;

var app = {
	testZip: 94709,
	lat: "",
	long: "",
	artist: "Glass Animals",
	formattedArtist: "Glass+Animals",
	spotify: "",
	youtube: "", 
	bio: "",
	imageUrl: "",
	address: [],
	map: {},
	//call functions that need to be called when the page loads in the start app method
	startApp: function(){
		app.getGeoPosition();

		app.addBandName();
		app.callMusicGraph();
		app.purchaseLinks();
        app.callLastFm();
        app.searchBand();
        //app.callJambase();
        app.spotifyWidget();
        app.youtubeLink();
        app.soundcloud();
        app.itunes();
		//app.googleMaps();
		//app.farmersMarket();
	},

	addBandName: function(){
		$('#bandName').html(app.artist);
	},
	// ajax call to api for band summmary information
	callMusicGraph: function(){
		var musicGraphId;
		//get general music graph info like music graph id and spotify and youtube ids
		$.ajax({
			url: "http://api.musicgraph.com/api/v2/artist/search?api_key=c8303e90962e3a5ebd5a1f260a69b138&name=" + app.artist,
			method: "GET"
		}).done(function(response){
			var data = response.data[0];
			musicGraphId = data.id;
			app.spotify = data.spotify_id;
			app.youTube = data.youtube_id;
            app.artist = data.name;
			console.log(data, app.spotify, app.youTube);
			// get bio info on the artist
			$.ajax({
				url: "http://api.musicgraph.com/api/v2/artist/" + musicGraphId + "/biography?api_key=c8303e90962e3a5ebd5a1f260a69b138&explaintext",
				method: "GET"
			}).done(function(response) {
				console.log(response, response.data.artist_bio_short);
				//get short bio and parse the markup returned
				app.bio = response.data.artist_bio_short.replace(/(\[.*?\])/g, '');
				console.log(app.bio);
				$('#content-div').html('<h4>' + app.bio + '<h4>');//remove and put in a different function that draws to the page
			});
			$.ajax({
				url: "http://api.musicgraph.com/api/v2/artist/" + musicGraphId + "/metrics/twitter?api_key=c8303e90962e3a5ebd5a1f260a69b138&explaintext",
				method: "GET"
			}).done(function(response) {
				console.log(response);
			})
		});
	},

	callLastFm: function(){
		// call lastFm for img
		$.ajax({
			url: "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + app.artist + "&api_key=651401dc542766eb3d39ccee850cb749&format=json",
			method: "GET"
		}).done(function(response){
			console.log(typeof(response.artist.image[3]['#text']));
			app.imageUrl = response.artist.image[3]['#text'];
			$("#image-div").html('<img class="img-responsive" src=' + app.imageUrl + '>');
		});
	},

	searchBand: function() {
		// click search button
		$('#search-button').on('click', function(){
			event.preventDefault();
			console.log('hi');
			// get value from search input
			var searchedArtist = $('#search-input').val().trim();
			console.log(searchedArtist);
			app.artist = searchedArtist;
			// format artist name for query string
			app.formattedArtist = searchedArtist.split(" ").join('+');
			// recall music graph and last fm to grab artist info
			app.addBandName();
			app.callMusicGraph();
			app.callLastFm();
			app.googleMaps();
			app.purchaseLinks();
			console.log(app.formattedArtist);
		});
	},

    spotifyWidget: function() {
        $('#spotify-widget').on('click', function() {
            event.preventDefault();
            console.log(app.spotify);
            // re-align widget, override the default margin
            $('#listen-row').attr('style','margin-left: 0px;');
            $('#listen-row').html('<iframe src="https://open.spotify.com/embed?uri=spotify:artist:'+ app.spotify +'" width="300" height="80" frameborder="0" allowtransparency="true"></iframe>')
        });
    },

    youtubeLink: function() {
        $('#youtube-link').on('click', function() {
            event.preventDefault();
            console.log(app.youtube);
            window.open('https://www.youtube.com/channel/' + app.youtube);
        });
    }, 

    soundcloud: function() {
        $('#soundcloud-link').on('click', function() {
            event.preventDefault();
            console.log(app.artist.replace(/\s/g, ''));
            // does not always work. some artist's links are different from just their names
            // for example, soundcloud.com/glassanimals works fine but
            // kendrick lamar is soundcloud.com/kendrick-lamar-music, not soundcloud.com/kendricklamar
            window.open('https://soundcloud.com/' + app.artist.replace(/\s/g, '').toLowerCase());
        });
    },

    itunes: function() {
        $('#itunes-link').on('click', function() {
            event.preventDefault();
            console.log('hi')
            // $('#itunes-link').attr('<a href="https://geo.itunes.apple.com/us/album/how-to-be-a-human-being/id1119848454?mt=1&app=music" style="display:inline-block;overflow:hidden;background:url(//linkmaker.itunes.apple.com/assets/shared/badges/en-us/music-lrg.svg) no-repeat;width:110px;height:40px;background-size:contain;"></a>')
        });
		
	},
	callJambase: function() {
		$.ajax({
			url: 'http://api.jambase.com/artists?name=' + app.artist+ '&page=0&api_key=5md9jsgapzxv8aw35nmdsbz5',
			method: 'GET'
		}).done(function(response) {
			var jambaseId = response.Artists[0].Id;
			console.log(response, jambaseId);
			$.ajax({
				url: 'http://api.jambase.com/events?artistId=' + jambaseId + '&zipCode='+ app.testZip + '&radius=3000&page=0&api_key=5md9jsgapzxv8aw35nmdsbz5',
				method: 'GET'
			}).done(function(response) {
				console.log(response);
				var eventArr = response.Events;
				for(var i=0; i<eventArr.length; i++) {
					var latitude = eventArr[i].Venue.Latitude;
					var longitude = eventArr[i].Venue.Longitude;
					console.log(latitude, longitude);
					var latLng = new google.maps.LatLng(latitude, longitude);
					console.log(latLng);
					var marker = new google.maps.Marker({
						map: map,
						position: latLng
					});
				}
			});
		});
	},

	googleMaps: function() {
		// var lat;
		// var long;
		// navigator.geolocation.getCurrentPosition(function(pos){
		// 	var coords = pos.coords;
		// 	lat = coords.latitude; 
		// 	long = coords.longitude;
		// 	console.log(lat, long);
			// map options
			mapOption = {
				zoom: 10,
				center: new google.maps.LatLng(app.lat, app.long),
				panControl: false,
				zoomControl: true,
				zoomControlOptions: {
					style: google.maps.ZoomControlStyle.LARGE,
					position: google.maps.ControlPosition.RIGHT_CENTER
				},
				scaleControl: false
			}

			infoWindow = new google.maps.InfoWindow({
				content: "holding..."
			});

			//make new map centered on us
			map = new google.maps.Map(document.getElementById("map"), mapOption);
			
			//console.log(map);
			coordArr = app.address;
			//app.callJambase();
			//console.log(app.address[0]);
		 
		//function(err) {
		// 	console.log(err.code) 
		// });

		
		// // map options
		// mapOption = {
		// 	zoom: 10,
		// 	center: new google.maps.LatLng(lat, long),
		// 	panControl: false,
		// 	zoomControl: true,
		// 	zoomControlOptions: {
		// 		style: google.maps.ZoomControlStyle.LARGE,
		// 		position: google.maps.ControlPosition.RIGHT_CENTER
		// 	},
		// 	scaleControl: false
		// }

		// infoWindow = new google.maps.InfoWindow({
		// 	content: "holding..."
		// });

		// //make new map centered on us
		// map = new google.maps.Map(document.getElementById("map"), mapOption);
		
		// //console.log(map);
		// coordArr = app.address;
		// //console.log(app.address[0]);
		
	}, 

	getGeoPosition: function() {
		navigator.geolocation.getCurrentPosition(function(pos){
			var coords = pos.coords;
			app.lat = coords.latitude; 
			app.long = coords.longitude;
			console.log(app.lat, app.long);
			app.googleMaps();
		}, function(err) {
				console.log(err.code) 
		});
	},

	purchaseLinks: function(){
		$('#itunes-purchase').attr("href", "https://www.apple.com/itunes/music/");
		$('#google-purchase').attr('href', 'https://play.google.com/store/search?q='+app.formattedArtist);
		$('#amazon-purchase').attr('href', 'https://www.amazon.com/s/ref=nb_sb_ss_i_1_5?url=search-alias%3Ddigital-music&field-keywords='+app.formattedArtist);

	}

	// farmersMarket: function() {
	// 	zip = 94709;
	// 	$.ajax({
	// 		url:  "https://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + zip,
	// 		method: "GET"
	// 	}).done(function(response){
	// 		/*console.log(response);*/
	// 		var marketArr = response.results;
	// 		for(var i=0; i < marketArr.length; i++){
	// 			var id = marketArr[i].id;
	// 			$.ajax({
	// 				url: "https://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + id,
	// 				method:"GET"
	// 			}).done(function(response) {
	// 				/*console.log(response);*/
	// 				var googleLink = response.marketdetails.GoogleLink;
	// 				/*console.log(googleLink);*/
	// 				var latLng = decodeURIComponent(googleLink.substring(googleLink.indexOf("=")+1, googleLink.lastIndexOf("(")));
	// 				/*console.log(latLng);*/
	// 				//app.address.push(latLng);
	// 				var split = latLng.split(',');
	// 				var lat = split[0];
	// 				var long = split[1];
	// 				var mylatlng = new google.maps.LatLng(lat, long);
	// 				/*console.log(mylatlng);*/
	// 				var marker = new google.maps.Marker({
	// 					map: map,
	// 					position: mylatlng
	// 				});
	// 				//console.log(marker);
	// 			});
	// 		}
	// 	});
	// }	
};


$(document).ready(function(){
	//call app.startApp in jquery ready functioin
	app.startApp();
});
