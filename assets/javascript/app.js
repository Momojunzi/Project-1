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

//twitter widget code
window.twttr = (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
    if (d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);

    t._e = [];
    t.ready = function(f) {
        t._e.push(f);
    };
    return t;
}(document, "script", "twitter-wjs"));


var app = {
	artist: "Glass+Animals",
	formattedArtist: "",
	spotify: "",
	youtube: "",
    twitter: "",
    instagram: "",
	bio: "",
	imageUrl: "",
	address: [],
	map: {},
	//call functions that need to be called when the page loads in the start app method
	startApp: function(){
		app.callMusicGraph();
        app.callLastFm();
        app.searchBand();
        app.spotifyWidget();
        app.youtubeLink();
        app.soundcloud();
        app.itunes();
		app.googleMaps();
		app.farmersMarket();
        app.twitter();
        app.instagram();
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
            // getting twitter handle
            $.ajax({
                url: "http://api.musicgraph.com/api/v2/artist/" + musicGraphId + "/social-urls?api_key=c8303e90962e3a5ebd5a1f260a69b138&explaintext",
                method: "GET"
            }).done(function(response) {
                var twitter_url = response.data.twitter_url[0];
                console.log(twitter_url)
                twitter_handle = twitter_url.split('/').pop();
                var insta_url = response.data.instagram_url[0];
                console.log(insta_url);
                insta_handle = insta_url.split('/').pop();
                app.twitter = twitter_handle;
                app.instagram = insta_handle;
                console.log('twit: ', app.twitter, 'insta: ', app.instagram)
            });
		});
	},

	callLastFm: function(){
		// call lastFm for img
		$.ajax({
			url: "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + app.artist + "&api_key=651401dc542766eb3d39ccee850cb749&format=json",
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
            // clear current displays
            $('#social-display').html('');
            $('#listen-display').html('');
            $('#search-input').val('');
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
            $('#listen-display').attr('style','margin: 10px 0px 10px 0px; ');
            $('#listen-display').html('<iframe src="https://open.spotify.com/embed?uri=spotify:artist:'+ app.spotify +'" width="300" height="80" frameborder="0" allowtransparency="true"></iframe>')
        });
    },

    youtubeLink: function() {
        $('#youtube-link').on('click', function() {
            event.preventDefault();
            console.log(app.youtube);
            window.open('http://www.youtube.com/channel/' + app.youtube);
        });
    }, 

    soundcloud: function() {
        $('#soundcloud-link').on('click', function() {
            event.preventDefault();
            console.log(app.artist.replace(/\s/g, ''));
            // does not always work. some artist's links are different from just their names
            // for example, soundcloud.com/glassanimals works fine but
            // kendrick lamar is soundcloud.com/kendrick-lamar-music, not soundcloud.com/kendricklamar
            window.open('http://soundcloud.com/' + app.artist.replace(/\s/g, '').toLowerCase());
        });
    },

    itunes: function() {
        $('#itunes-link').on('click', function() {
            event.preventDefault();
            console.log('hi')
            $('#itunes-link').html('<a href="https://geo.itunes.apple.com/us/album/how-to-be-a-human-being/id1119848454?mt=1&app=music" style="display:inline-block;overflow:hidden;background:url(//linkmaker.itunes.apple.com/assets/shared/badges/en-us/music-lrg.svg) no-repeat;width:110px;height:40px;background-size:contain;"></a>')
        });
	},

	songKick: function() {
		$.ajax({
			url: 'http://api.songkick.com/api/3.0/events.json?apikey='
		});
	},


    twitter: function() {
        $('#twitter-link').on('click', function() {
            event.preventDefault();

            twttr.widgets.createTimeline({
                sourceType: 'profile',
                screenName: app.twitter
            }, 

            document.getElementById('social-display'),
            
            {   
                width: '450',
                height: '500',
            });
        });
    },

    instagram: function() {

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
	},

	signIn: function(){
		$('#sign-in').on('click', function(){
			var email = $('#sign-in-email').val().trim();
			var pass = $('#sign-in-password').val().trim();
			firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error){
				console.log(error.code);
			})


			firebase.auth().onAuthStateChanged(function(user) {
			  if (user) {
			    // User is signed in.
			    var displayName = user.displayName;
			    var userEmail = user.email;
			    console.log(userEmail);
			    // ...
			  } else {
			    // User is signed out.
			    // ...
			  }
			});

		});
	},
	register: function() {
		console.log('Register function executed')

		$('#register-user').on('click', function (event) {
			console.log('register-user clicked')

			event.preventDefault();


			var uname=$('#sign-up-name').val().trim();
			console.log(uname);
			var email = $('#sign-up-email').val().trim();
			console.log(email);
			var pass = $('#sign-up-password').val().trim();
			var zip = $('#zipcode').val().trim();
			

			if (email.length < 4) {
	      		alert('Please enter an email address.');
	        	return;
      		}
      		if (pass.length < 4) {
	       	 	alert('Please enter a password.');
	        	return;
      		}
      		if ((zip.length < 5) || (zip.length > 5)) {
	       	 	alert('Please enter a valid zipcode.');
	        	return;
      		}
      		if (uname.length < 3) {
	       	 	alert('Name should be of minimum 3 letters.');
	        	return;
      		}

      		database.ref().push({

    			email:email,
    			password:pass,
    			zip:zip,
    			uname:uname
    			//created:firebase.database.ServerValue.TIMESTAMP
  			});

	      	firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) {
		        var errorCode = error.code;
		        var errorMessage = error.message;
		        if (errorCode === 'auth/weak-password') {
		        	alert('The password is too weak.');
		        } else if (errorCode === 'auth/invalid-email'){
		        	alert('Invalid E-mail');
		        } else {
		        	alert(errorMessage);
		        }
		        console.log(error);
		    });

		    $('#regModal').modal('hide');
		});
	},
	startApp: function() {
		this.signIn();
		this.register();
	}
	
};

$("#login-modal").click(function(){
	$('#regModal').modal('hide');
	$('#passModal').modal('hide');
	$('#myModal').modal('show');
});


$("#register-modal").click(function(){
	$('#myModal').modal('hide');
	$('#passModal').modal('hide');
	$('#regModal').modal('show');
});

$("#fPassword-modal").click(function(){
	$('#myModal').modal('hide');
	$('#regModal').modal('hide');
	$('#passModal').modal('show');
});



$(document).ready(function(){
	//call app.startApp in jquery ready functioin
	app.startApp();
});
