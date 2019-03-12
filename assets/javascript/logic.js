//Initialize Firebase
var config = {
    apiKey: firebaseApiKey,
    authDomain: "project1-616bd.firebaseapp.com",
    databaseURL: "https://project1-616bd.firebaseio.com",
    projectId: "project1-616bd",
    storageBucket: "project1-616bd.appspot.com",
    messagingSenderId: "39559179000"
};
firebase.initializeApp(config);

// ############ initialize global variables ############ 
let countryName;
let countryCapitalName;

// ############ construct API query URLs ############ 

// ------------- COUNTRY ------------- 
let countryCode = "DO";
// note: this code is based on ISO_3166-2, a 2 digit country code
// the list of all country codes can be found here: https://en.wikipedia.org/wiki/ISO_3166-2
let countryQueryURL = "https://restcountries.eu/rest/v2/alpha/" + countryCode; 

$.ajax({
    url: countryQueryURL,
    method: "GET"
}).then(function(response) {
    console.log(response);
    let results = response;
    let countryData = {
        "countryName":results.name,
        "capital":results.capital,
        "region":results.region,  
        "flag":results.flag,
        "language":results.languages[0].name,
        "language-code":results.languages[0].iso639_1,
        "population":results.population,
        "currencyName":results.currencies[0].name,
        "currencyCode":results.currencies[0].code
    }
    console.log(countryData);
    // take the country name and capital name selected from the map 
    // and put it into a format that can be used with the weather and time API calls
    countryName = countryData.countryName
    countryCapitalName = countryData.capital;  
    console.log(countryName, countryCapitalName);

    // ------------- WEATHER API CALL------------- 
    let locationOfInterest = (countryCapitalName.replace(" ", "+")+","+countryName.replace(" ", "+"));
    console.log("this is the loc of interest: " + locationOfInterest);
    var weatherQueryURL = "https://api.worldweatheronline.com/premium/v1/weather.ashx?format=json&key="+worldweatherApiKey+"&q="+location;
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
        "currentWeatherC":weatherResponse.data.current_condition[0].temp_C,
        "currentWeatherF":weatherResponse.data.current_condition[0].temp_F,
        "currentWeatherIcon":weatherResponse.data.current_condition[0].weatherIconUrl[0].value
        }
        for (let i=1 ; i<7 ; i++){ 
            forecastWeather6days[i] = {
                "maxTempC":weatherResponse.data.weather[i].maxtempC,
                "minTempC":weatherResponse.data.weather[i].mintempC,
                "maxTempF":weatherResponse.data.weather[i].maxtempF,
                "minTempF":weatherResponse.data.weather[i].mintempF
                }
            }
        console.log(forecastWeather6days);
    });


}); 

// ------------- TIME ------------- 
// var timeQueryURL = "https://api.worldweatheronline.com/premium/v1/tz.ashx?format=json&key="+worldweatherApiKey+"q="+location;
// $.ajax({
//     url: timeQueryURL,
//     method: "GET"
// }).then(function (timeResponse) {
//         console.log(timeResponse);

//     });

  