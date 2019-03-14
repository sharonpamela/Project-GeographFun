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
localStorage.clear();

// initialize GLOBAL variables 
var country;


// var locationOfInterestTime;
let strCountryData;
let objCountryData;
let strForecastWeather6days;
let objForecastWeather6days;
let strLocationOfInterestTime;
let objLocationOfInterestTime;
let userName = "";
let userState = "";

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

$("#mapButton").on("click",function(){
    $("#intro").hide();
    $("#globe").hide();
    $("#user_input").hide();

    $("#greeting").append("Hello, " + userName + ", from " + userState + "!");
    $(".main").show();
    $("#anychart-embed-ZgsIrI7P").show();
})



// Whenever a user clicks the click button
$("#start-button").on("click", function (event) {
    event.preventDefault();

    // Get the input values
    userName = $("#name").val().trim();
    userState = $("#state").val().trim();

    $("#intro").hide();
    $("#globe").hide();
    $("#user_input").hide();

    $("#greeting").append("Hello, " + userName + ", from " + userState + "!");
    $(".main").show();
    $("#anychart-embed-ZgsIrI7P").show();
});






// ############ API DATA RETRIEVE AND STORE  ############ 
// function to construct API query URLs, call APIS, store important info in local storage
$("#anychart-embed-ZgsIrI7P").dblclick(function () {
    let countryData = {};
    let locationOfInterestTime = {};
    let forecastWeather6days = {};

    // ------------- COUNTRY API CALL ------------- 

    // note: this code is based on ISO_3166-2, a 2 digit country code
    let countryQueryURL = "https://restcountries.eu/rest/v2/alpha/" + country;

    $.ajax({
        url: countryQueryURL,
        method: "GET"
    }).then(function (response) {
        let results = response;
        countryData = {
            "countryName": results.name,
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
        // make dictionary into string
        strCountryData = JSON.stringify(countryData);
        // Store all content into localStorage
        localStorage.setItem("strCountryData", strCountryData);

        // use country name and capital name selected from the map in the weather and time API calls query
        let countryName = countryData.countryName
        let countryCapitalName = countryData.capital;

        // ------------- WEATHER API CALL------------- 
        let locationOfInterest = (countryCapitalName.replace(" ", "+") + "," + countryName.replace(" ", "+"));
        var weatherQueryURL = "https://api.worldweatheronline.com/premium/v1/weather.ashx?format=json&key=07446752c7d0497b977214242190803&q=" + location;
        $.ajax({
            url: weatherQueryURL,
            method: "GET"
        }).then(function (weatherResponse) {
            console.log("######################### weather ###############################")
            // populate an array with weather info where INDEX 0 is the current date and time 
            // and the next subsequent days are forecasted moving forward
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
            // make dictionary into string
            strForecastWeather6days = JSON.stringify(forecastWeather6days);
            // Store all content into localStorage
            localStorage.setItem("strForecastWeather6days", strForecastWeather6days);

            // ------------- TIME API CALL ------------- 
            var timeQueryURL = "https://api.worldweatheronline.com/premium/v1/tz.ashx?format=json&key=07446752c7d0497b977214242190803&q=" + locationOfInterest;
            $.ajax({
                url: timeQueryURL,
                method: "GET"
            }).then(function (timeResponse) {
                locationOfInterestTime = {
                    "dateTime": timeResponse.data.time_zone[0].localtime,
                    "utcOffset": timeResponse.data.time_zone[0].utcOffset,
                    "timeZone": timeResponse.data.time_zone[0].zone
                }
                console.log(locationOfInterestTime);
                // make dictionary into string
                strLocationOfInterestTime = JSON.stringify(locationOfInterestTime);
                // Store all content into localStorage
                localStorage.setItem("strLocationOfInterestTime", strLocationOfInterestTime);

                // ############ redirect to game page ############ 
            window.location.href = "gamepage.html";

            });//end of TIME API CALL

        });//end of WEATHER API CALL

    });//end of COUNTRY API CALL

});// end of API DATA RETRIEVE AND STORE



