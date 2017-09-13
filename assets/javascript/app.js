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
    userId:"",
    signedIn: false,
    geoposition: false,
    testZip: 94709,
    lat: "",
    long: "",
    artist: "Glass Animals",
    formattedArtist: "Glass+Animals",
    ontour: "",
    spotify: "",
    youtube: "",
    twitter: "",
    instagram: "",
    facebook: "",
    bio: "",
    imageUrl: "",
    address: [],
    map: {},
    trackArr: [],
    //call functions that need to be called when the page loads in the start app method
    startApp: function(){
        app.callLastFm();
        app.addBandName();
        app.callMusicGraph();
        app.purchaseLinks();
        app.searchBand();
        app.spotifyWidget();
        app.youtubeLink();
        app.soundcloud();
        app.itunes();
        app.twitter();
        app.instagram();
        app.facebook();
        app.addFavorites();
        this.signIn();
        this.register();
<<<<<<< HEAD
	},

	addBandName: function(){
		$('#bandName').html(app.artist);
		console.log(app.signedIn);
	},
	// ajax call to api for band summmary information
	callMusicGraph: function(){
		var musicGraphId;
		//get general music graph info like music graph id and spotify and youtube ids
		$.ajax({
			url: "http://api.musicgraph.com/api/v2/artist/search?api_key=c8303e90962e3a5ebd5a1f260a69b138&name=" + app.formattedArtist,
			method: "GET"
		}).done(function(response){
			var data = response.data[0];
			musicGraphId = data.id;
			app.spotify = data.spotify_id;
			app.youtube = data.youtube_id;
            app.artist = data.name;
			//console.log(data, app.spotify, app.youtube);
			// get bio info on the artist
			$.ajax({
				url: "http://api.musicgraph.com/api/v2/artist/" + musicGraphId + "/biography?api_key=c8303e90962e3a5ebd5a1f260a69b138&explaintext",
				method: "GET"
			}).done(function(response) {
				//console.log(response, response.data.artist_bio_short);
				//get short bio and parse the markup returned
				app.bio = response.data.artist_bio_short.replace(/(\[.*?\])/g, '');
				//console.log(app.bio);
				$('#content-div').html('<h4>' + app.bio + '<h4>');//remove and put in a different function that draws to the page
			});
=======
    },

    addBandName: function(){
        $('#bandName').html(app.artist);
        console.log(app.signedIn);
    },
    // ajax call to api for band summmary information
    callMusicGraph: function(){
        var musicGraphId;
        //get general music graph info like music graph id and spotify and youtube ids
        $.ajax({
            url: "https://api.musicgraph.com/api/v2/artist/search?api_key=c8303e90962e3a5ebd5a1f260a69b138&name=" + app.formattedArtist,
            method: "GET"
        }).done(function(response){
            var data = response.data[0];
            musicGraphId = data.id;
            app.spotify = data.spotify_id;
            app.youtube = data.youtube_id;
            app.artist = data.name;
            //console.log(data, app.spotify, app.youtube);
            // get bio info on the artist
            $.ajax({
                url: "https://api.musicgraph.com/api/v2/artist/" + musicGraphId + "/biography?api_key=c8303e90962e3a5ebd5a1f260a69b138&explaintext",
                method: "GET"
            }).done(function(response) {
                //console.log(response, response.data.artist_bio_short);
                //get short bio and parse the markup returned
                app.bio = response.data.artist_bio_short.replace(/(\[.*?\])/g, '');
                //console.log(app.bio);
                $('#content-div').html('<h4>' + app.bio + '<h4>');//remove and put in a different function that draws to the page
            });
>>>>>>> 2b29b79ab470baad923cc7d2ec5dcc21060afe48
            // getting twitter handle
            $.ajax({
                url: "http://api.musicgraph.com/api/v2/artist/" + musicGraphId + "/social-urls?api_key=c8303e90962e3a5ebd5a1f260a69b138&explaintext",
                method: "GET"
            }).done(function(response) {
                var twitter_url = response.data.twitter_url[0];
                twitter_handle = twitter_url.split('/').pop();
                var insta_url = response.data.instagram_url[0];
                var fb_url = response.data.facebook_url;
                console.log(twitter_url)
                console.log(insta_url);
                console.log(fb_url);
                //insta_handle = insta_url.split('/').pop();
                app.twitter = twitter_handle;
                app.instagram = insta_url
                app.facebook = fb_url;
                console.log('twit: ', app.twitter, 'insta: ', app.instagram)
            });
        });
    },

    callLastFm: function(){
        // call lastFm for img
        $.ajax({
            url: "https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" + app.formattedArtist + "&api_key=651401dc542766eb3d39ccee850cb749&format=json"
        }).done(function(response) {
            app.trackArr = [];
            for (var i=0; i<10; i++) {
                app.trackArr.push(response.toptracks.track[i]);
                console.log(app.trackArr);
            }
        });
        $.ajax({
            url: "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + app.formattedArtist + "&api_key=651401dc542766eb3d39ccee850cb749&format=json",
            method: "GET"
        }).done(function(response){
            console.log(response);
            app.ontour = response.artist.ontour;
            console.log(app.ontour);
            console.log(typeof(response.artist.image[3]['#text']));
            app.imageUrl = response.artist.image[3]['#text'];
            $("#image-div").html('<img class="img-responsive" src=' + app.imageUrl + '>');
            if (app.ontour === "0"){
                app.d3Function();

            }
            if(app.ontour === "1"){
                if(app.geoposition === false) {
                    app.getGeoPosition();
                }else{
                    app.googleMaps();
                }
            }
        });
    },

    searchBand: function() {
        // click search button
        $('#search-button').on('click', function(){
            event.preventDefault();
            // clear current displays
            $('#social-display').html('');
            $('#listen-display').html('');
            $('#tour-div').html('');
            var searchedArtist = $('#search-input').val().trim();
            console.log(searchedArtist);
            app.artist = searchedArtist;
            console.log(app.artist);
            // format artist name for query string
            app.formattedArtist = searchedArtist.split(" ").join('+');
            console.log(app.formattedArtist);
            // recall music graph and last fm to grab artist info
            app.addBandName();
            //app.callMusicGraph();
            //app.callLastFm();
            //app.purchaseLinks();
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

    callJambase: function() {
        $.ajax({
            url: 'http://api.jambase.com/artists?name=' + app.formattedArtist+ '&page=0&api_key=5md9jsgapzxv8aw35nmdsbz5',
            method: 'GET'
        }).done(function(response) {
            var jambaseId = response.Artists[0].Id;
            console.log(response, jambaseId);
            $.ajax({
                url: 'http://api.jambase.com/events?artistId=' + jambaseId + '&zipCode='+ app.testZip + '&radius=5000&page=0&api_key=5md9jsgapzxv8aw35nmdsbz5',
                method: 'GET'
            }).done(function(response) {
                console.log(response);
                var eventArr = response.Events;
                    for(var i=0; i<eventArr.length; i++) {
                        var latitude = eventArr[i].Venue.Latitude;
                        var longitude = eventArr[i].Venue.Longitude;
                        console.log(latitude, longitude);
                        var myLatLng = new google.maps.LatLng(latitude, longitude);
                        console.log(myLatLng);
                        var marker = new google.maps.Marker({
                            map: map,
                            position: myLatLng
                        });
                        //app.logTours(eventArr[i]);
                        console.log(eventArr[i].Venue.Name, eventArr[i].Date, eventArr[i].Venue.City, eventArr[i].Venue.StateCode, eventArr[i].TicketUrl);
                        var location = $('<h3>').html(eventArr[i].Venue.Name);

                        var date = $('<h4>').html(eventArr[i].Date);
                        var city = $('<h4>').html(eventArr[i].Venue.City + ", " + eventArr[i].Venue.StateCode);
                        var ticketUrl = $('<a>').attr({href: eventArr[i].TicketUrl, target: "_blank"}).html("Buy tickets Here");
                        var concertDiv= $('<div class="concert-div">').append(location, date, city, ticketUrl, '<hr style="border-width:1px" />');
                        $('#tour-div').append(concertDiv);
                    }
            });
        });
    },

    logTours: function(concert){
        console.log(concert.Venue.Name, concert.Date, concert.Venue.City, concert.Venue.StateCode, concert.TicketUrl);
        var location = $('h3').html(concert.Venue.Name);

        var date = $('h4').html(concert.Date);
        var city = $('h4').html(concert.Venue.City + ", " + concert.Venue.StateCode);
        var ticketUrl = $('<a>').attr({href: concert.TicketUrl, target: "_blank"}).html("Buy tickets Here");
        var concertDiv= $('<div class="concert-div">').append(location, date, city, ticketUrl, '<hr style="border-width:1px" />');
        $('#tour-div').append(concertDiv);
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
                height: '500'
            });
        });
    },

    instagram: function() {
        $('#instagram-link').on('click', function() {
            event.preventDefault();
            window.open(app.instagram);
        });
    },

    facebook: function() {
        $('#facebook-link').on('click', function() {
            event.preventDefault();
            window.open(app.facebook);
        });
    },

    googleMaps: function() {
    
<<<<<<< HEAD
 			firebase.auth().onAuthStateChanged(function(user) {
			  if (user) {
			    // User is signed in.
			    app.userId = user.uid;
				  app.signedIn = true;
				  if(app.signedIn === true){
					  app.addFavorites();
				  }
				  console.log(app.signedIn);
			  } else {
			    // User is signed out.
			  }
			});
				$('#regModal').modal('hide');
			});
	},

	register: function() {
		console.log('Register function executed');
		$('#register-user').on('click', function (event) {
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

			firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) {
		        var errorCode = error.code;
		        var errorMessage = error.message;
				var favorites = [];
		        if (errorCode === 'auth/weak-password') {
		        	alert('The password is too weak.');
		        } else if (errorCode === 'auth/invalid-email'){
		        	alert('Invalid E-mail');
		        } else {
		        	alert(errorMessage);
		        }
		        console.log(error);
			});

			firebase.auth().onAuthStateChanged(function(user) {
				if (user) {
					// User is signed in.
					var userId = user.uid;
					database.ref().push({
						userId:userId
						//created:firebase.database.ServerValue.TIMESTAMP
					});
					database.ref(userId).set({
						email:email,
						zip:zip,
						uname:uname,
						favorites:""
					});
					console.log(userId);
					// ...
				} else {
					// User is signed out.
				}
			});
			$('#regModal').modal('hide');
		});

		$('#regModal').on('hidden.bs.modal', function () {
    		$(this).find('form').trigger('reset');
		});
	},

	addFavorites: function() {
		database.ref("/"+ app.userId+ "/favorites").on('value', function(snapshot){
			console.log(snapshot.val());
			var favobj = snapshot.val();
			var favArr = Object.values(favobj);
			$('#favorites').empty();
			for(var i=0; i<favArr.length; i++) {
				var favDiv = $('<h4 class="favorite">').html(favArr[i]);
				$('#favorites').append(favDiv).append('<hr/>');
			}
			console.log(favArr);
		});
		if(app.signedIn) {
			$('#addFavorites').css({color: '#42b3f4', display: 'block'});
		}else{
			$('#addFavorites').css({display: 'none'});
		}
		$('#addFavorites').on('click', function(){
				database.ref("/"+ app.userId+ "/").child("favorites").child(app.artist).set(app.artist);
				console.log("favorites clicked");
			});
	},

	forgotPassword: function() {
		$('#fpassuser').on('click', function () {
			event.preventDefault();
			console.log('starting');
			var uname=$('#fp-username').val().trim();
			console.log(uname);
			var email = $('#fp-email').val().trim();
			console.log(email);
			var zip = $('#fp-zip').val().trim();

			 firebase.auth.sendPasswordResetEmail(email).catch(function(error){
			 	console.log('starting reset function');
				var errorCode = error.code;
  				var errorMessage = error.message;

  				if (errorCode === 'auth/operation-not-allowed') {
    			alert('You must enable Anonymous auth in the Firebase Console.');
  				} 
  				else {
    				console.error(error);
  				}
=======
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
            };

            infoWindow = new google.maps.InfoWindow({
                content: "holding..."
            });

            //create new map centered on geolocation
            map = new google.maps.Map(document.getElementById("map"), mapOption);
            
            //console.log(map);
            coordArr = app.address;
            app.farmersMarket();
            //app.callJambase();
            
    }, 

    getGeoPosition: function() {
        navigator.geolocation.getCurrentPosition(function(pos){
            var coords = pos.coords;
            app.lat = coords.latitude; 
            app.long = coords.longitude;
            console.log(app.lat, app.long);
            app.geoposition = true;
            app.googleMaps();
        }, function(err) {
                console.log(err.code) 
        });
    },

    purchaseLinks: function(){
        $('#itunes-purchase').attr("href", "https://www.apple.com/itunes/music/");
        $('#google-purchase').attr('href', 'https://play.google.com/store/search?q='+app.formattedArtist);
        $('#amazon-purchase').attr('href', 'https://www.amazon.com/s/ref=nb_sb_ss_i_1_5?url=search-alias%3Ddigital-music&field-keywords='+app.formattedArtist);

    },

    farmersMarket: function() {
        zip = app.testZip;
        $.ajax({
            url:  "https://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + zip,
            method: "GET"
        }).done(function(response){
            /*console.log(response);*/
            var marketArr = response.results;
            for(var i=0; i < marketArr.length; i++){
                var id = marketArr[i].id;
                $.ajax({
                    url: "https://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + id,
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
                    //console.log(marker);
                });
            }
        });
    },  

    d3Function: function() {
        $("#tour-div").html("");
        $('#map-title').html('Record Sales Chart');
        $('#map').html('There are no upcoming tours instead have a look at some record sales data');
        $('#tour-list-title').html('Record Sales List');
    },
        
    signIn: function(){

        $('#sign-in').on('click', function(){
            event.preventDefault();
            if (firebase.auth().currentUser) {
                // [START signout]
                firebase.auth().signOut();
                $('#login-modal').modal('hide');
                $('#logout-user').css('display', 'none');
                // [END signout]
            } else {       
                var email = $('#sign-in-email').val().trim();
                var password = $('#sign-in-password').val().trim();
                if (email.length < 4) {
                  alert('Please enter an email address.');
                  return;
                }
                if (password.length < 4) {
                      alert('Please enter a password.');
                      return;
                } 
            }

            // Sign in with email and pass.
            // [START authwithemail]
            firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // [START_EXCLUDE]
                if (errorCode === 'auth/wrong-password') {
                    alert('Wrong password.');
                } else {
                    alert(errorMessage);
                }
                console.log(error);
                $('#sign-in').disabled = false;
                // [END_EXCLUDE]
            });

            console.log('success');
            $('#myModal').modal('hide');
            $('#logout-user').css('display', 'block');
            $('#login-modal').css('display', 'none');
            console.log('trying...')
    
            firebase.auth().onAuthStateChanged(function(user) {
                  if (user) {
                    // User is signed in.
                    app.userId = user.uid;
                      app.signedIn = true;
                      if(app.signedIn === true){
                          app.addFavorites();
                      }
                      console.log(app.signedIn);
                  } else {
                    // User is signed out.
                  }
            });
                $('#regModal').modal('hide');
            });
    },

    register: function() {
        console.log('Register function executed');
        $('#register-user').on('click', function (event) {
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

            firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                var favorites = [];
                if (errorCode === 'auth/weak-password') {
                    alert('The password is too weak.');
                } else if (errorCode === 'auth/invalid-email'){
                    alert('Invalid E-mail');
                } else {
                    alert(errorMessage);
                }
                console.log(error);
            });

            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    // User is signed in.
                    var userId = user.uid;
                    database.ref().push({
                        userId:userId
                        //created:firebase.database.ServerValue.TIMESTAMP
                    });
                    database.ref(userId).set({
                        email:email,
                        zip:zip,
                        uname:uname,
                        favorites:""
                    });
                    console.log(userId);
                    // ...
                } else {
                    // User is signed out.
                }
            });
            $('#regModal').modal('hide');
        });

        $('#regModal').on('hidden.bs.modal', function () {
            $(this).find('form').trigger('reset');
        });
    },

    addFavorites: function() {
        database.ref("/"+ app.userId+ "/favorites").on('value', function(snapshot){
            console.log(snapshot.val());
            var favobj = snapshot.val();
            var favArr = Object.values(favobj);
            $('#favorites').empty();
            for(var i=0; i<favArr.length; i++) {
                var favDiv = $('<h4 class="favorite">').html(favArr[i]);
                $('#favorites').append(favDiv).append('<hr/>');
            }
            console.log(favArr);
        });
        if(app.signedIn) {
            $('#addFavorites').css({color: '#42b3f4', display: 'block'});
        }else{
            $('#addFavorites').css({display: 'none'});
        }
        $('#addFavorites').on('click', function(){
                database.ref("/"+ app.userId+ "/").child("favorites").child(app.artist).set(app.artist);
                console.log("favorites clicked");
            });
    },

    forgotPassword: function() {
        $('#fpassuser').on('click', function () {
            event.preventDefault();
            console.log('starting');
            var uname=$('#fp-username').val().trim();
            console.log(uname);
            var email = $('#fp-email').val().trim();
            console.log(email);
            var zip = $('#fp-zip').val().trim();

             firebase.auth.sendPasswordResetEmail(email).catch(function(error){
                console.log('starting reset function');
                var errorCode = error.code;
                var errorMessage = error.message;

                if (errorCode === 'auth/operation-not-allowed') {
                alert('You must enable Anonymous auth in the Firebase Console.');
                } 
                else {
                    console.error(error);
                }
>>>>>>> 2b29b79ab470baad923cc7d2ec5dcc21060afe48
            });
          });
    },
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