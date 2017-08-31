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

var bandApp = {
	user: "",
	signIn: function(){
		$('#sign-in').on('click', function(){
			user = $('#sign-in-email').val().trim();
			var pass = $('#sign-in-password').val().trim();
			console.log(user, pass);
		});
	},
	register: function() {
		console.log('register clicked');
	},
	startApp: function() {
		this.signIn();
		this.register();
	}
}

$(document).ready(function(){
	bandApp.startApp();
});

