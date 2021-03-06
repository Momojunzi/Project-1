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
        //app.youtubeLink();
        //app.soundcloud();
		app.twitter();
        //app.instagram();
        //app.facebook();
        app.addFavorites();
        app.signIn();
        app.register();
        app.forgotPassword();
        app.logout();
        app.clickFavorite();
	},

    addBandName: function(){
    	var splitArtist = app.artist.split(' ');
    	for(var i=0; i<splitArtist.length; i++){
    		var name = splitArtist[i].split('');
    		name[0] = name[0].toUpperCase();
    		splitArtist[i] = name.join('');
    	}
    	var capitolArtist = splitArtist.join(' ');
    	console.log(capitolArtist);
        $('#bandName').html(capitolArtist);
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
                $('#content-div').html('<p>' + app.bio + '<p>');//remove and put in a different function that draws to the page
            });
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
                app.twitter = twitter_handle;
                app.instagram = insta_url
                app.facebook = fb_url;
                app.socialLinks();
                app.listenLinks();
                console.log('twit: ', app.twitter, 'insta: ', app.instagram)
            });
        });
    },

    callLastFm: function(){
        // call lastFm for img
        
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
			$.ajax({
	            url: "https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" + app.formattedArtist + "&api_key=651401dc542766eb3d39ccee850cb749&format=json"
	        }).done(function(response) {
	            app.trackArr = [];
	            for (var i=0; i<10; i++) {
	                app.trackArr.push(response.toptracks.track[i]);
	                console.log(app.trackArr);
	            }
	            if (app.ontour === "0"){
		            app.d3Function();
		            $("#map-title").html('Top Tracks By Plays');
                	$('#tour-list-title').html('Top Tracks By Listeners');
				}
		        if(app.ontour === "1"){
		        	$("#map-title").html('Upcoming Tour Locations');
                	$('#tour-list-title').html('Upcoming Tour Dates');
		            if(app.geoposition === false) {
		                app.getGeoPosition();
		            }else{
		                app.googleMaps();
		            }
		        }
	        });
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
			app.callMusicGraph();
			app.callLastFm();
			app.purchaseLinks();
			console.log(app.formattedArtist);
			// if(app.ontour === '1') {
			// 	$("#map-title").html('Upcoming Tour Locations');
   //              $('#tour-list-title').html('Upcoming Tour Dates');
			// }
			// if(app.ontour === '0'){
			// 	$("#map-title").html('Top Tracks By Plays');
   //              $('#tour-list-title').html('Top Tracks By Listeners');
			// }
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

    //listen links
    spotifyWidget: function() {
        $('#spotify-widget').on('click', function() {
            event.preventDefault();
            console.log(app.spotify);
            // re-align widget, override the default margin
            $('#listen-display').attr('style','margin: 10px 0px 10px 0px; ');
            $('#listen-display').html('<iframe src="https://open.spotify.com/embed?uri=spotify:artist:'+ app.spotify +'" width="300" height="80" frameborder="0" allowtransparency="true"></iframe>')
        });
    },

    listenLinks: function() {
        $('#youtube-link').attr("href", 'http://www.youtube.com/channel/' + app.youtube);
        //$('#soundcloud-link').attr("href", 'http://soundcloud.com/' + app.artist.replace(/\s/g, '').toLowerCase());
      },

    // purchase links
    purchaseLinks: function(){
        $('#itunes-purchase').attr("href", "https://www.apple.com/itunes/music/");
        $('#google-purchase').attr('href', 'https://play.google.com/store/search?q='+app.formattedArtist);
        $('#amazon-purchase').attr('href', 'https://www.amazon.com/s/ref=nb_sb_ss_i_1_5?url=search-alias%3Ddigital-music&field-keywords='+app.formattedArtist);

    },

    //social links
    twitter: function() {
        $('#twitter-link').on('click', function() {
            event.preventDefault();

            twttr.widgets.createTimeline({
                sourceType: 'profile',
                screenName: app.twitter
            }, 

            document.getElementById('social-display'),
            
            {   width: '450',
                height: '500'
            });
        });
    },

    socialLinks: function() {
        $('#instagram-link').attr("href", app.instagram);
        $('#facebook-link').attr("href", app.facebook);
      },

     googleMaps: function() {
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
            //app.farmersMarket();
            app.callJambase();
            
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
        $("#map").html("");
       // $('#map-title').html('<h3>Top Tracks by plays</h3>')
        //var trackArr =[{name:"one", playcount:1000000, listens:1006000},{name:'two', playcount:140500,listens:100600},{name:"three", playcount:105000,listens:102650},{name:"four", playcount:150000,listens:100800}]
        var tracks = app.trackArr.map(function(t){
            return t.name;
        });
        var margin = {top: 10, right: 0, bottom: 20, left: 50}
       	var width = 750;
       	var height = 450;
       	var xScale = d3.scaleLinear()
			.domain([0, app.trackArr[1].playcount/*d3.max(trackArr, function(d){return d.playcount})]*/])
       		.range([0, width-margin.left-margin.right])
			.nice();
        var listenxScale = d3.scaleLinear()
			.domain([0, app.trackArr[1].listeners/*d3.max(trackArr, function(d){return d.playcount})]*/])
			.range([0, width-margin.left-margin.right])
			.nice();
        var trackScale = d3.scaleBand()
			.domain([0, tracks])
			.range([0, height/(tracks.length/2)])
		.paddingInner(0.1);
        var bandwidth = trackScale.bandwidth();
       	var svg = d3.select('#map').append('svg')
       		.attr('width', width)
       		.attr('height', height);
		svg.selectAll('rect').data(app.trackArr).enter().append('rect')
			.attr('height', bandwidth)
			.attr('width', function(d,i){return xScale(d.playcount)})
			//.attr('width', function(d,i){return xScale(d.playcount/1000) - width - margin.left })
			.attr('x', 0)
			.attr('y', function(d,i){return (i * (bandwidth +1))})
			.attr('class', 'bar');
		svg.selectAll('text').data(app.trackArr).enter().append('text')
			.text(function(d,i){return (i+1) + ":  " + d.name + " " + d.playcount + " plays"})
			.attr('x', margin.left/2)
			.attr('y', function(d,i){return i * bandwidth + (bandwidth)})
			.attr('class', 'plays-text');

		$("#tour-div").html("");
       // $('#tour-list-title').html('<h3>Top Tracks by listeners</h3')
       	var width = 750;
       	var height = 450;
       	var svg = d3.select('#tour-div').append('svg')
			.attr('width', width)
			.attr('height', height);
		svg.selectAll('rect').data(app.trackArr).enter().append('rect')
			.attr('height', bandwidth)
			.attr('width', function(d,i){return listenxScale(d.listeners)})
			.attr('x', 0)
			.attr('y', function(d,i){return (i * (bandwidth +1))})
			.attr('class', 'listen-bar');
        svg.selectAll('text').data(app.trackArr).enter().append('text')
			.text(function(d,i){return (i+1) + ":  " + d.name + " " + d.listeners + " listeners"})
			.attr('x', margin.left/2)
			.attr('y', function(d,i){return i * bandwidth + (bandwidth/2)})
			.attr('class', 'plays-text');
    },
        
    signIn: function(){

        $('#sign-in').on('click', function(event){
            event.preventDefault();
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
            firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                console.log(error);
            });

            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
					firebase.auth().signOut();
					$('#logout-user').css('display', 'block');
					$('#myModal').modal('hide');
					$('#logout-user').css('display', 'block');
					$('#login-modal').css('display', 'none');
					$('#addFavorites').css('display', 'block');
					$('#fav').css('display', 'block');
          			app.userId = user.uid;
                    app.signedIn = true;
                    if(app.signedIn === true){
                          app.addFavorites();
                    }
                	console.log(app.signedIn);
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

            firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                var favorites = [];
            });

            firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
                console.log(error)
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
                var favDiv = $('<h4>').addClass("favorite-entry").html(favArr[i]);
                $('#favorites').append(favDiv).append('<hr/>');
            }
            app.clickFavorite();
            console.log(favArr);
        });
        if(app.signedIn) {
        	$('#fav').css('display', 'block');
            $('#addFavorites').css({color: 'hsl(199, 17%, 99%)', display: 'block'});
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
            });
          });
    },

    logout: function() {
        console.log('test logout');
        $('#logout-user').on('click', function() {
            event.preventDefault();
            console.log('Signed Out');
            $('#logout-user').css('display', 'none');
            $('#login-modal').css('display', 'block');
            $('#addFavorites').css('display', 'none');
            $('#fav').css('display', 'none');
            firebase.auth().signOut().catch(function(error) {

                if (error)
                {
                    alert ('Unable to Sign-out');

                }

                else {
                    console.log ('Signed out Successfully');
                }
			});
        });
	},

    clickFavorite: function() {
        var clickedFav = $(".favorite-entry");
    	clickedFav.on('click', function(){
    		console.log("favorite!");
            $('#social-display').html('');
            $('#listen-display').html('');
            $('#tour-div').html('');
            var searchedArtist = $(this).html();
            console.log(searchedArtist);
            app.artist = searchedArtist;
            console.log(app.artist);
            // format artist name for query string
            app.formattedArtist = searchedArtist.split(" ").join('+');
            console.log(app.formattedArtist);
            // recall music graph and last fm to grab artist info
            app.addBandName();
            app.callMusicGraph();
            app.callLastFm();
            app.purchaseLinks();
            console.log(app.formattedArtist);

    	});
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
