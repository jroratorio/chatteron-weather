var weather = require('weather-js');
var NodeGeocoder = require('node-geocoder');
var args = require('yargs').argv;
var config = require('./config.json');
 
var options = {
  provider: 'google',
 
  httpAdapter: 'https', // Default
  apiKey: config.googleApi,
  formatter: null         // 'gpx', 'string', ...
};

var findTemperatureByCity = function(city, unit) {
    
    if(unit !== 'C' || unit !== 'F'){
        unit === 'F';//setting default unit as F
    }
    weather.find({search: city, degreeType: unit}, function(err, result) {
        if(err) {
            console.log('Temperature fetch error ' + err);
        } else {
            console.log('Temperature at ' + result[0].location.name + ' is ' + result[0].current.temperature + " " + result[0].location.degreetype);
        }  
    });
};

var findCityByCoordinates = function( lat, long, unit ){
    var geocoder = NodeGeocoder(options);
    geocoder.reverse({lat:lat, lon:long}, function(err, res) {
        if(err){
            console.log('Google Geocoder error ' + err.message);
        }
        else {
            var city = res[0].city;
            if(city){
                findTemperatureByCity( city, unit );
            }
            else{
                console.log('Google geocoder - invalid city coordinates ' + lat + ' ' + long);
            }                
        }        
    });    
};

var findTemperatureByCoordinates = function(lat, long, unit) {
    findCityByCoordinates(lat, long, unit);
    
}

//defaults set for London
var lat = args.lat || '51.5';
var long = args.long  || '0.12';
var unit = args.unit || 'C';

findTemperatureByCoordinates( lat, long, unit);


