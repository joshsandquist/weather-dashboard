//global variable for api key as we will be using it on multiple ocacssions
var APIKey = '73cac212d998043d18f6cc88473fb507';

//Search function for our city search
//We will need to gather the city's coordinates for use with the 5 Day forecast api
document.getElementById('search-form').addEventListener('submit', function(event) {
    //Preventing default form action
    event.preventDefault();
    // getting the user's entered city and saving as a variable 'city'
    var city = document.getElementById('city-input').value;
    // Passing in city name to getCoordinates function
    getCoordinates(city);
});

function getCoordinates(city) {
    //creating API search using user inputted city and api key
    var searchAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIKey}`
    fetch(searchAPI)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        //returning the lattitude and longitude data from our search to be used in future function
        if (data.length > 0) {
            var lat = data[0].lat;
            var lon = data[0].lon;
            getWeather(lat,lon)
        }
        else {
            alert('City not found!')
        }
    })
    // catch block for error handling
    .catch(function(error) {
        alert('Error:' + error)
    })
}

function getWeather(lat, lon) {
    var weatherAPI =`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;
}