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
var access_key = "0ca86bec1f0165a7741f";
var country;
var currency;
var countryData;
var locationOfInterestTime;

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

$("#anychart-embed-ZgsIrI7P").dblclick(function(){

// ############ construct API query URLs ############ 
// Clear localStorage before storing each api response
localStorage.clear();

// ------------- COUNTRY API CALL ------------- 
//country = "DO";
// note: this code is based on ISO_3166-2, a 2 digit country code
// the list of all country codes can be found here: https://en.wikipedia.org/wiki/ISO_3166-2
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
    let strCountryData = JSON.stringify(countryData);
    // Store all content into localStorage
    localStorage.setItem("strCountryData", strCountryData);

    // Expected output:
    // countryData = {
        // capital: "Washington, D.C."
        // countryName: "United States of America"
        // currencyCode: "USD"
        // currencyName: "United States dollar"
        // flag: "https://restcountries.eu/data/usa.svg"
        // language: "English"
        // language-code: "en"
        // population: 323947000
        // region: "Americas"
        // }

    // ------------- CURRENCY -------------
    // execute the  conversion using the "convert" endpoint:
    currency = countryData.currencyCode;
    console.log(currency);
    $.ajax({
        url: "https://free.currencyconverterapi.com/api/v6/convert?q=USD_" + currency + "," + currency + "_USD&compact=ultra&apiKey=" + access_key,
        method: "GET"
        }).then(function (response) {
        console.log(response);
    });

    
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
        // make dictionary into string
        let strForecastWeather6dayse = JSON.stringify(forecastWeather6days);
        // Store all content into localStorage
        localStorage.setItem("strLocationOfInterestTime", strForecastWeather6dayse);

        // Expected output:
            // forecastWeather6days = {
            // 0: {currentWeatherC: "36", currentWeatherF: "97", currentWeatherIcon: "http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0008_clear_sky_night.png"}
            // 1: {maxTempC: "40", minTempC: "27", maxTempF: "104", minTempF: "80"}
            // 2: {maxTempC: "41", minTempC: "26", maxTempF: "105", minTempF: "80"}
            // 3: {maxTempC: "41", minTempC: "27", maxTempF: "105", minTempF: "80"}
            // 4: {maxTempC: "39", minTempC: "27", maxTempF: "103", minTempF: "81"}
            // 5: {maxTempC: "38", minTempC: "26", maxTempF: "101", minTempF: "80"}
            // 6: {maxTempC: "39", minTempC: "25", maxTempF: "101", minTempF: "77"}
            // }
    });//end of WEATHER API CALL

    // ------------- TIME OF LOCATION OF INTEREST API CALL ------------- 
    var timeQueryURL = "https://api.worldweatheronline.com/premium/v1/tz.ashx?format=json&key=07446752c7d0497b977214242190803&q="+locationOfInterest;
    $.ajax({
        url: timeQueryURL,
        method: "GET"
        }).then(function (timeResponse) {
            locationOfInterestTime = {
                "dateTime":timeResponse.data.time_zone[0].localtime,
                "utcOffset":timeResponse.data.time_zone[0].utcOffset, 
                "timeZone": timeResponse.data.time_zone[0].zone
            }
            console.log(locationOfInterestTime);
            // make dictionary into string
            let strLocationOfInterestTime = JSON.stringify(locationOfInterestTime);
            // Store all content into localStorage
            localStorage.setItem("strLocationOfInterestTime", strLocationOfInterestTime);            
            
            // Expected Output: 
            // locationOfInterestTime = 
            // {dateTime: "2019-03-12 17:28", utcOffset: "-4.0", timeZone: "America/Santo_Domingo"}
    });//end of TIME OF LOCATION OF INTEREST
    
    // ############ CALCULATE THE TIME using moment.js ############ 
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
    // console.log("epoch current time: " + epochUserLocalTime)
    console.log("pretty remote time: " + prettyRemoteTime);
    // console.log("epoch remote time: " + epochRemoteTime);

    //Expected output:
    // pretty current time: March 12th 2019, 14:28:17
    // logic.js:168 epoch current time: 1552426097800
    // logic.js:169 pretty remote time: March 12th 2019, 17:28:17
    // logic.js:170 epoch remote time: 1552426097800

    });//end of COUNTRY API CALL

    // ############ redirect to game page ############ 
    window.location.href = "gamepage.html";
    $("#country_name").text("Colombia");

});

// $("#capital-city").click(countryData, function(object1) {
//     $("#instructions").hide();
//     $("#capital").empty();
//     $("#capital").append('<h3 class="animated pulse">The capital city of' + object1.countryName + ' is ' + object1.capital+ '.</h3>');
//     $("#capital").append('<p>' + object1.countryName + 'is in the ' + object1.regionName + ' of region.</p>');
//     $("#capital").append("<p>The country's population is currently at</p>");
//     //var population_string = CommaFormatted(object1.population);
//     $("#capital").append('<p style="font-size: 75px;" class="animated tada delay-1s">' + object1.population + '</p>');
//     $("#capital").show();
// });

$("#capital-city").on("click",function() {
    // retrieve the country from localStorage
    let strCountryData = localStorage.getItem("strCountryData");

    // parse dictionaries back into json format
    let objCountryData = JSON.parse(strCountryData);

    console.log(objCountryData);

    $("#instructions").hide();
    $("#capital").empty();
    $("#capital").append('<h3 class="animated pulse">The capital city of ' + objCountryData.countryName + ' is ' + objCountryData.capital+ '.</h3>');
    // $("#capital").append('<p>' + object1.countryName + 'is in the ' + object1.regionName + ' of region.</p>');
    // $("#capital").append("<p>The country's population is currently at</p>");
    //var population_string = CommaFormatted(object1.population);
    // $("#capital").append('<p style="font-size: 75px;" class="animated tada delay-1s">' + object1.population + '</p>');
    $("#capital").show();
});

function CommaFormatted(amount) {
	var delimiter = ","; // replace comma if desired
	var a = amount.split('.',2)
	var d = a[1];
	var i = parseInt(a[0]);
	if(isNaN(i)) { return ''; }
	var minus = '';
	if(i < 0) { minus = '-'; }
	i = Math.abs(i);
	var n = new String(i);
	var a = [];
	while(n.length > 3) {
		var nn = n.substr(n.length-3);
		a.unshift(nn);
		n = n.substr(0,n.length-3);
	}
	if(n.length > 0) { a.unshift(n); }
	n = a.join(delimiter);
	if(d.length < 1) { amount = n; }
	else { amount = n + '.' + d; }
	amount = minus + amount;
	return amount;
}

