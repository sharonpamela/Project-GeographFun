//Initialize Firebase
var config = {
    apiKey: "AIzaSyBvUT-jpC4knutoC3105OoxGyPmwPruf0I",
    authDomain: "project1-616bd.firebaseapp.com",
    databaseURL: "https://project1-616bd.firebaseio.com",
    projectId: "project1-616bd",
    storageBucket: "project1-616bd.appspot.com",
    messagingSenderId: "39559179000"
};
firebase.initializeApp(config);


// initialize GLOBAL variables 
let countryCapitalName;
var country;
var access_key = "0ca86bec1f0165a7741f";
var currency;

// Create a variable to reference the database.
var database = firebase.database();
// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function (snap) {

    // If they are connected..
    if (snap.val()) {

        // Add user to the connections list.
        var con = connectionsRef.push(true);

        // Remove user from the connection list when they disconnect.
        con.onDisconnect().remove();
    }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function (snapshot) {
    // Display the viewer count in the html.
    // The number of online users is the number of children in the connections list.
    $("#connected-viewers").text(snapshot.numChildren());
});

// Whenever a user clicks the click button
$("#start-button").on("click", function (event) {
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

// ############ construct API query URLs ############ 

// ------------- CURRENCY -------------
// execute the  conversion using the "convert" endpoint:
$.ajax({
    url: "https://free.currencyconverterapi.com/api/v6/convert?q=USD_" + currency + "," + currency + "_USD&compact=ultra&apiKey=" + access_key,
    method: "GET"
}).then(function (response) {
    console.log(response);
});

// ------------- COUNTRY API CALL ------------- 
country = "DO";
// note: this code is based on ISO_3166-2, a 2 digit country code
// the list of all country codes can be found here: https://en.wikipedia.org/wiki/ISO_3166-2
let countryQueryURL = "https://restcountries.eu/rest/v2/alpha/" + country;

$.ajax({
    url: countryQueryURL,
    method: "GET"
    }).then(function (response) {
        console.log(response);
        let results = response;
        let countryData = {
            "nameCountry": results.name,
            "capital": results.capital,
            "region": results.region,
            "flag": results.flag,
            "language": results.languages[0].name,
            "language-code": results.languages[0].iso639_1,
            "population": results.population,
            "currencyName": results.currencies[0].name,
            "currencyCode": results.currencies[0].code
    }
    console.log(countryData);

    // take the country name and capital name selected from the map 
    // and put it into a format that can be used with the weather and time API calls
    let countryName = countryData.nameCountry
    countryCapitalName = countryData.capital;
    console.log(countryName, countryCapitalName);

    // ------------- WEATHER API CALL------------- 
    let locationOfInterest = (countryCapitalName.replace(" ", "+") + "," + countryName.replace(" ", "+"));
    console.log("this is the loc of interest: " + locationOfInterest);
    var weatherQueryURL = "https://api.worldweatheronline.com/premium/v1/weather.ashx?format=json&key=" + worldweatherApiKey + "&q=" + location;
    console.log(weatherQueryURL);
    $.ajax({
        url: weatherQueryURL,
        method: "GET"
        }).then(function (weatherResponse) {
            console.log("This is the weather object");
            console.log(weatherResponse);
            // populate an array with weather info where INDEX 0 is the current date and time 
            // and the next subsequent days are forecasted moving forward
            let forecastWeather6days = {};
            forecastWeather6days[0] = {
                "currentWeatherC": weatherResponse.data.current_condition[0].temp_C,
                "currentWeatherF": weatherResponse.data.current_condition[0].temp_F,
                "currentWeatherIcon": weatherResponse.data.current_condition[0].weatherIconUrl[0].value
            }
            for (let i = 1; i < 7; i++) {
                forecastWeather6days[i] = {
                    "maxTempC": weatherResponse.data.weather[i].maxtempC,
                    "minTempC": weatherResponse.data.weather[i].mintempC,
                    "maxTempF": weatherResponse.data.weather[i].maxtempF,
                    "minTempF": weatherResponse.data.weather[i].mintempF
                }
        }
        console.log(forecastWeather6days);
    });//end of WEATHER API CALL

    // ------------- TIME OF LOCATION OF INTEREST ------------- 
    var timeQueryURL = "https://api.worldweatheronline.com/premium/v1/tz.ashx?format=json&key="+worldweatherApiKey+"&q="+locationOfInterest;
    $.ajax({
        url: timeQueryURL,
        method: "GET"
        }).then(function (timeResponse) {
            console.log(timeResponse);
            let locationOfInterestTime = {
                "dateTime":timeResponse.data.time_zone[0].localtime,
                "utcOffset":timeResponse.data.time_zone[0].utcOffset, 
                "timeZone": timeResponse.data.time_zone[0].zone
            };
            console.log(locationOfInterestTime);
    });//end of TIME OF LOCATION OF INTEREST
    
    // EXAMPLE TIMERESPONSE:
    locationOfInterestTime = { dateTime: "2019-03-12 14:00", timeZone: "America/Santo_Domingo", utcOffset: "-4.0" }

    // ------------- CALCULATE THE TIME using moment.js------------- 
    // get current user local time
    let epochUserLocalTime = moment(); //number of seconds since January 1, 197
    // convert local user time to remote location's time
    let remoteTimeZone = locationOfInterestTime.timeZone; //format ex:"America/Santo_Domingo"
    let epochRemoteTime = moment.tz(epochUserLocalTime, remoteTimeZone); // format ex:"2014-06-22T09:21:08-07:00
    //convert time to prettier format for display
    let prettyLocalTime = epochUserLocalTime.format('MMMM Do YYYY, HH:mm:ss');
    let prettyRemoteTime = epochRemoteTime.format('MMMM Do YYYY, HH:mm:ss')
    //log the times to screen
    console.log("pretty current time: " + prettyLocalTime);
    console.log("epoch current time: " + epochUserLocalTime)
    console.log("pretty remote time: " + prettyRemoteTime);
    console.log("epoch remote time: " + epochRemoteTime);

});//end of COUNTRY API CALL


