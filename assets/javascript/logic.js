  /* Initialize Firebase
  var config = {
    apiKey: apiKey,
    authDomain: "project1-616bd.firebaseapp.com",
    databaseURL: "https://project1-616bd.firebaseio.com",
    projectId: "project1-616bd",
    storageBucket: "project1-616bd.appspot.com",
    messagingSenderId: "39559179000"
  };
  firebase.initializeApp(config); */

   /* global moment firebase */
// Initialize Firebase
// Make sure to match the configuration to the script version number in the HTML
// (Ex. 3.0 != 3.7.0)
var config = {
  apiKey: "AIzaSyD1eVlZJkk53xp0qdph7FvHZNhFDLtQOwU",
  authDomain: "classacitivity.firebaseapp.com",
  databaseURL: "https://classacitivity.firebaseio.com",
  projectId: "classacitivity",
  storageBucket: "classacitivity.appspot.com",
  messagingSenderId: "978114446376"
};
firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

var country;

// -------------------------------------------------------------- (CRITICAL - BLOCK) --------------------------- //
// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function(snap) {

// If they are connected..
if (snap.val()) {

  // Add user to the connections list.
  var con = connectionsRef.push(true);

  // Remove user from the connection list when they disconnect.
  con.onDisconnect().remove();
}
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snapshot) {

// Display the viewer count in the html.
// The number of online users is the number of children in the connections list.
$("#connected-viewers").text(snapshot.numChildren());
});

// Whenever a user clicks the click button
$("#start-button").on("click", function(event) {
event.preventDefault();

// Get the input values
var userName = $("#name").val().trim();
var userState = $("#state").val().trim();

$("#intro").hide();
$("#globe").hide();
$("#user_input").hide();

$("#greeting").append("Hello, " + userName + ", from " + userState + "!");
$(".main").show();
$("#anychart-embed-ZgsIrI7P").show();

});

var access_key = "0ca86bec1f0165a7741f";
var currency = "COP";

// execute the conversion using the "convert" endpoint:
$.ajax({   
    url: "https://free.currencyconverterapi.com/api/v6/convert?q=USD_" + currency + "," + currency + "_USD&compact=ultra&apiKey=" + access_key,
    method: "GET"
    }).then(function(response) {
    console.log(response);
});