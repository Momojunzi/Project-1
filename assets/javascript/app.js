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

	//call functions that need to be called when the page loads in the start app method
	startApp: function(){
		this.bandSummary();
	},
	// ajax call to api for band summmary information
	bandSummary: function(){
		var artist = "Glass+Animals"

		$.ajax({
			url: "http://api.musicgraph.com/api/v2/artist/search?api_key=c8303e90962e3a5ebd5a1f260a69b138&name=" + artist,
			method: "GET"
		}).done(function(response){
			var data = response;
			console.log(data, artist);
		});
	}

}



$(document).ready(function(){
	//call app.startApp in jquery ready functioin
	app.startApp();
});