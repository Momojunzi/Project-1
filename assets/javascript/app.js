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
	artist: "Glass+Animals",
	formattedArtist: "",
	spotify: "",
	youtube: "", 
	bio: "",
	imageUrl: "",
	address: [],
	map: {},
	//call functions that need to be called when the page loads in the start app method
	startApp: function(){
		this.callMusicGraph();
        this.callLastFm();
        this.searchBand();
        this.spotifyWidget();
        this.youtubeLink();
        this.soundcloud();
        this.itunes();
		this.googleMaps();
		this.farmersMarket();
	},
	// ajax call to api for band summmary information
	callMusicGraph: function(){
		var musicGraphId;
		//get general music graph info like music graph id and spotify and youtube ids
		$.ajax({
			url: "https://api.musicgraph.com/api/v2/artist/search?api_key=c8303e90962e3a5ebd5a1f260a69b138&name=" + this.artist,
			method: "GET"
		}).done(function(response){
			var data = response.data[0];
			musicGraphId = data.id;
			this.spotify = data.spotify_id;
			this.youTube = data.youtube_id;
            this.artist = data.name;
			console.log(data, this.spotify, this.youTube);
			// get bio info on the artist
			$.ajax({
				url: "https://api.musicgraph.com/api/v2/artist/" + musicGraphId + "/biography?api_key=c8303e90962e3a5ebd5a1f260a69b138&explaintext",
				method: "GET"
			}).done(function(response) {
				console.log(response, response.data.artist_bio_short);
				//get short bio and parse the markup returned
				this.bio = response.data.artist_bio_short.replace(/(\[.*?\])/g, '');
				console.log(this.bio);
				$('#content-div').html('<h4>' + this.bio + '<h4>');//remove and put in a different function that draws to the page
			})
		});
	},

	callLastFm: function(){
		// call lastFm for img
		$.ajax({
			url: "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + this.artist + "&api_key=651401dc542766eb3d39ccee850cb749&format=json",
			method: "GET"
		}).done(function(response){
			console.log(typeof(response.artist.image[3]['#text']));
			this.imageUrl = response.artist.image[3]['#text'];
			$("#image-div").html('<img class="img-responsive" src=' + this.imageUrl + '>');
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
			app.callMusicGraph();
			app.callLastFm();
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
	songKick: function() {
		$.ajax({
			url: 'http://api.songkick.com/api/3.0/events.json?apikey='
		})
	},

	googleMaps: function() {
		// map options
		mapOption = {
			zoom: 10,
			center: new google.maps.LatLng(37.871853, -122.258423),
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
		
		console.log(map);
		coordArr = app.address;
		console.log(app.address[0]);
		
	}, 

	farmersMarket: function() {
		zip = 94709;
		$.ajax({
			url:  "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + zip,
			method: "GET"
		}).done(function(response){
			/*console.log(response);*/
			var marketArr = response.results;
			for(var i=0; i < marketArr.length; i++){
				var id = marketArr[i].id;
				$.ajax({
					url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + id,
					method:"GET"
				}).done(function(response) {
					/*console.log(response);*/
					var googleLink = response.marketdetails.GoogleLink;
					/*console.log(googleLink);*/
					var latLng = decodeURIComponent(googleLink.substring(googleLink.indexOf("=")+1, googleLink.lastIndexOf("(")));
					/*console.log(latLng);*/
					//app.address.push(latLng);
					var split = latLng.split(',');
					var lat = split[0];
					var long = split[1];
					var mylatlng = new google.maps.LatLng(lat, long);
					/*console.log(mylatlng);*/
					var marker = new google.maps.Marker({
						map: map,
						position: mylatlng
					});
					console.log(marker);
				});
			}
		});
	}	
};


$(document).ready(function(){
	//call app.startApp in jquery ready functioin
	app.startApp();
});
