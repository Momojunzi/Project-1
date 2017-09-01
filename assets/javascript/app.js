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

