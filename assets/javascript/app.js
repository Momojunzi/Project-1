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

var app = {
	artist: "Glass+Animals",
	spotify: "",
	youTube: "", 
	bio: "",
	imageUrl: "",
	//call functions that need to be called when the page loads in the start app method
	startApp: function(){
		this.callMusicGraph();
		this.callLastFm();
	},
	// ajax call to api for band summmary information
	callMusicGraph: function(){
		
		var musicGraphId;
		//get general music graph info like music graph id and spotify and youtube ids
		$.ajax({
			url: "http://api.musicgraph.com/api/v2/artist/search?api_key=c8303e90962e3a5ebd5a1f260a69b138&name=" + this.artist,
			method: "GET"
		}).done(function(response){
			var data = response.data[0];
			musicGraphId = data.id;
			this.spotify = data.spotify_id;
			this.youTube = data.youtube_id;
			console.log(data, this.spotify, this.youTube);
			// get bio info on the artist
			$.ajax({
				url: "http://api.musicgraph.com/api/v2/artist/" + musicGraphId + "/biography?api_key=c8303e90962e3a5ebd5a1f260a69b138&explaintext",
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
		$.ajax({
			url: "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + this.artist + "&api_key=651401dc542766eb3d39ccee850cb749&format=json",
			method: "GET"
		}).done(function(response){
			console.log(typeof(response.artist.image[3]['#text']));
			this.imageUrl = response.artist.image[3]['#text'];
			$("#image-div").append('<img class="img-responsive" src=' + this.imageUrl + '>');
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
    }

};



$(document).ready(function(){
	//call app.startApp in jquery ready functioin
	app.startApp();
});