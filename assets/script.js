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
    //new API search string using lat and lon data to get more data
    var weatherAPI =`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;
    //using api search string to return all the data we will need
    fetch(weatherAPI)
    .then(function(response) {
        return response.json();
    })
    //Passing in retrieved data into two new functions, one to get current weather and one to get future forecast.
    .then(function(data) {
        showCurrentWeather(data);
        showFiveDay(data);
    })
    .catch(function(error) {
        alert('Error:' + error)
    })
}

//function to show current weather, takes in data from previous search as a paramater
function showCurrentWeather(data) {
    //selection current weather section and setting data to empty initially
    var currentWeatherEl = document.getElementById('current-weather');
    currentWeatherEl.innerHTML = ''

    //data we will need to display
    var temperature = data.list[0].main.temp;
    var humidity = data.list[0].main.humidity;
    var windSpeed = data.list[0].wind.speed;
    var weatherIcon = data.list[0].weather[0].icon;

    //creating dynamic html elements with the data we have gathered
    //Setting the textContent of these elements to the specific data values we have gathered
    var temperatureEl = document.createElement('p');
    temperatureEl.textContent = 'Temperature: ' + temperature;

    var humidityEl = document.createElement('p');
    humidityEl.textContent = 'Humidity: ' + humidity + '%';

    var windEl = document.createElement('p');
    windEl.textContent = 'Wind Speed: ' + windSpeed +' MPH';
    //making a url string with the data we have gathered and setting it to the source of our icon image
    var weatherIconEl = document.createElement('img');
    weatherIconEl.src = `http://openweathermap.org/img/w/${weatherIcon}.png`;

    //Appending new elements to current weather section
    currentWeatherEl.appendChild(weatherIconEl);
    currentWeatherEl.appendChild(temperatureEl);
    currentWeatherEl.appendChild(humidityEl);
    currentWeatherEl.appendChild(windEl)
}
