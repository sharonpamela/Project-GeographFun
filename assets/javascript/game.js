// Clear localStorage before storing each of the API responses
//localStorage.clear();


// ############ RESTORE THE DATA FROM MAP PAGE INTO THE GAME PAGE ############ 
// retrieve the country from localStorage
strCountryData = localStorage.getItem("strCountryData");
// parse dictionaries back into json format
objCountryData = JSON.parse(strCountryData);
// retrieve the weather from localStorage
strForecastWeather6days = localStorage.getItem("strForecastWeather6days");
// parse dictionaries back into json format
objForecastWeather6days = JSON.parse(strForecastWeather6days);
// retrieve the time from localStorage
strLocationOfInterestTime = localStorage.getItem("strLocationOfInterestTime");
// parse dictionaries back into json format
objLocationOfInterestTime = JSON.parse(strLocationOfInterestTime);
console.log(objForecastWeather6days);
// ------------- CURRENCY API CALL -------------
// execute the  conversion using the "convert" endpoint:
let access_key = "0ca86bec1f0165a7741f";
let currency = objCountryData.currencyCode;
let countryToUsDollars;
let usDollarsToCountry;

$.ajax({
    url: "https://free.currencyconverterapi.com/api/v6/convert?q=USD_" + currency + "," + currency + "_USD&compact=ultra&apiKey=" + access_key,
    method: "GET"
}).then(function (response) {
    console.log(response);
    let results = response;
    console.log(results); 
    usDollarsToCountry = response[Object.keys(response)[0]]; //stores equivalent of 1 US dollar in remote country currency unit.
    countryToUsDollars = response[Object.keys(response)[1]]; //stores equivalent of 1 remote-currency-unit in US dollars.
});

// Expected output:
// objCountryData = {
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

// Expected output:
// objForecastWeather6days = {
// 0: {currentWeatherC: "36", currentWeatherF: "97", currentWeatherIcon: "http://cdn.worldweatheronline.net/images/wsymbols01_png_64/wsymbol_0008_clear_sky_night.png"}
// 1: {maxTempC: "40", minTempC: "27", maxTempF: "104", minTempF: "80"}
// 2: {maxTempC: "41", minTempC: "26", maxTempF: "105", minTempF: "80"}
// 3: {maxTempC: "41", minTempC: "27", maxTempF: "105", minTempF: "80"}
// 4: {maxTempC: "39", minTempC: "27", maxTempF: "103", minTempF: "81"}
// 5: {maxTempC: "38", minTempC: "26", maxTempF: "101", minTempF: "80"}
// 6: {maxTempC: "39", minTempC: "25", maxTempF: "101", minTempF: "77"}
// }

// Expected Output: 
// objLocationOfInterestTime = 
// {dateTime: "2019-03-12 17:28", utcOffset: "-4.0", timeZone: "America/Santo_Domingo"}

// ############ CALCULATE THE TIME using moment.js ############ 
// get current user local time
let epochUserLocalTime = moment(); //number of seconds since January 1, 197
// convert local user time to remote location's time
let remoteTimeZone = objLocationOfInterestTime.timeZone; //format ex:"America/Santo_Domingo"
let epochRemoteTime = moment.tz(epochUserLocalTime, remoteTimeZone); // format ex:"2014-06-22T09:21:08-07:00
//convert time to prettier format for display
let prettyLocalTime = epochUserLocalTime.format('MMMM Do YYYY, HH:mm:ss');
let prettyRemoteTime = epochRemoteTime.format('MMMM Do YYYY, HH:mm:ss')
//log the times to screen
// console.log("pretty current time: " + prettyLocalTime);
// console.log("epoch current time: " + epochUserLocalTime)
// console.log("pretty remote time: " + prettyRemoteTime);
// console.log("epoch remote time: " + epochRemoteTime);

//Expected output example:
//March 12th 2019, 14:28:17
      

// update the header of the game page
$("#country_name").text(objCountryData.countryName);


$("#capital-city").on("click",function() {
    console.log(objCountryData);
    clear_display();
    $("#instructions").hide();
    $("#capital").empty();
    $("#capital").append('<h3 class="animated pulse">The capital city of ' + objCountryData.countryName + ' is <u>' + objCountryData.capital+ '</u>.</h3>');
    $("#capital").append('<p>' + objCountryData.countryName + ' is in the ' + objCountryData.region + ' region.</p>');
    $("#capital").append("<p>The country's population is currently at</p>");
    $("#capital").append('<p style="font-size: 75px;" class="animated tada delay-1s">' + objCountryData.population + '</p>');
    $("#capital").show();
});

$("#display_flag").click(function() {
    clear_display();
    let imgLink = objCountryData.flag;
    $("#display").append('<img id="flag" class="animated flip" src='+imgLink+'>');
});

$("#display_lang").click(function() {
    clear_display();
    $("#language").append('<h3 class="animated flipInX">The official language of '+ objCountryData.countryName +' is <u>' + objCountryData.language + '</u>.<h3>');
    $("#language").append('<p>Click translate button and see all words on this page change!</p>');
    $("#language").append("Once clicked move box so you can see/pick the desired language<div id='MicrosoftTranslatorWidget' class='Dark' style='color:white;background-color:#555555'></div><script type='text/javascript'>setTimeout(function(){{var s=document.createElement('script');s.type='text/javascript';s.charset='UTF-8';s.src=((location && location.href && location.href.indexOf('https') == 0)?'https://ssl.microsofttranslator.com':'http://www.microsofttranslator.com')+'/ajax/v3/WidgetV3.ashx?siteData=ueOIGRSKkd965FeEGM5JtQ**&ctf=False&ui=true&settings=Manual&from=';var p=document.getElementsByTagName('head')[0]||document.documentElement;p.insertBefore(s,p.firstChild); }},0);</script>");
    $("#language").append('<p  class="animated lightSpeedIn">Hello&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Goodbye&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Thank you&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>');
});

$("#display_weather").click(function() {
    clear_display();
    $("#weather").append('<img class="animated heartBeat" src="' + objForecastWeather6days[0].currentWeatherIcon + '">');
    $("#weather").append('<h3 class="animated tada">It is currently '+ objForecastWeather6days[0].currentWeatherF +' ℉ in '+  objCountryData.capital + '.</h3>');       
    // $("#weather").append('<h7>Click image and see what happens</h7>');
    $("#weather").append('<p class="animated slideInLeft">Next 3-day Weather Forecast</p>');
    $("#weather").append('<p>High <u class="animated fadeInDown delay-1s">'+ objForecastWeather6days[1].maxTempF+ ' ℉ </u>&nbsp;&nbsp;&nbsp;&nbsp;<u class="animated fadeInDown delay-2s">'+ objForecastWeather6days[2].maxTempF+ ' ℉</u>&nbsp;&nbsp;&nbsp;&nbsp;<u class="animated fadeInDown delay-3s">'+ objForecastWeather6days[3].maxTempF+ '℉</u></p>');
    $("#weather").append('<p>Low <u class="animated fadeInDown delay-1s">'+ objForecastWeather6days[1].minTempF+ ' ℉</u>&nbsp;&nbsp;&nbsp;&nbsp;<u class="animated fadeInDown delay-2s">'+ objForecastWeather6days[2].minTempF+ ' ℉</u>&nbsp;&nbsp;&nbsp;&nbsp;<u class="animated fadeInDown delay-3s">'+ objForecastWeather6days[3].minTempF+ ' ℉</u></p>')   
});

$("#display_currency").click(function() {
    clear_display();
    $("#currency").append('<h3  class="animated fadeInDown">' + objCountryData.countryName +' uses <u>'+ objCountryData.currencyName +'</u>.<h3>');
    $("#currency").append('<p  class="animated fadeInDown delay-1s">$1 US Dollar = $ '+ usDollarsToCountry +' ' + objCountryData.currencyName +'</p>');
    $("#currency").append('<p  class="animated fadeInDown delay-2s">or</p>');
    $("#currency").append('<p  class="animated fadeInDown delay-3s">$1 '+objCountryData.currencyName+ ' = $ ' +countryToUsDollars+ ' US Dollar.</p>');  
    if (objCountryData.countryName === "United States of America")  {
        clear_display();
        $("#currency").append('<p>$1 United States dollar = $1 United States dollar.</p>');  
    }
});

$("#display_timedate").click(function() {
    clear_display();
    $("#date-time").append('<h3 class="animated fadeInDown">Current date and time in </h3>');
    $("#date-time").append('<h3 class="animated fadeInDown delay-1s">'+ objCountryData.capital +'. </h3>');
    $("#date-time").append('<p class="animated flash delay-2s">'+ prettyRemoteTime +'</p>');
    $("#date-time").append('<button id="toggle-btn2">Click for your local date/time</button>');
    $("#date-time").append('<p id="localtime" style="display: none;">'+ prettyLocalTime +'</p>');
    $("#toggle-btn2").click(function() {
       $("#localtime").show();
    });
});

function clear_display() {
    $("#instructions").hide();
    $("#flag").remove();
    $("#capital").empty();
    $("#language").empty();
    $("#currency").empty();
    $("#weather").empty();
    $("#date-time").empty();
}
