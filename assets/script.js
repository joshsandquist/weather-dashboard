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
            //saving the searched city into local storage
            saveSearchHistory(city)
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
    var weatherAPI =`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKey}`;
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
    var currentWeatherEl = document.getElementById('current-weather-content');
    currentWeatherEl.innerHTML = ''

    //data we will need to display
    var cityName = data.city.name;
    var temperature = data.list[0].main.temp;
    var humidity = data.list[0].main.humidity;
    var windSpeed = data.list[0].wind.speed;
    var weatherIcon = data.list[0].weather[0].icon;

    //creating dynamic html elements with the data we have gathered
    //Setting the textContent of these elements to the specific data values we have gathered
    var currentCard = document.createElement('div');

    var cityEl = document.createElement('h3');
    cityEl.textContent = cityName;


    var temperatureEl = document.createElement('p');
    temperatureEl.textContent = 'Temperature: ' + temperature + '°F';

    var humidityEl = document.createElement('p');
    humidityEl.textContent = 'Humidity: ' + humidity + '%';

    var windEl = document.createElement('p');
    windEl.textContent = 'Wind Speed: ' + windSpeed +' MPH';
    //making a url string with the data we have gathered and setting it to the source of our icon image
    var weatherIconEl = document.createElement('img');
    weatherIconEl.src = `http://openweathermap.org/img/w/${weatherIcon}.png`;

    //Appending new elements to current weather section
    currentCard.appendChild(cityEl)
    currentCard.appendChild(weatherIconEl);
    currentCard.appendChild(temperatureEl);
    currentCard.appendChild(windEl)
    currentCard.appendChild(humidityEl);
    
    currentWeatherEl.append(currentCard)
}

//Function to display the five day forecast
function showFiveDay(data) {
    //declaring forecast section and setting its data to an empty string to start
    var forecastEl = document.getElementById('forecast-content');
    forecastEl.innerHTML = ''

    //data returned from our api call comes in 3 hour increments, so we need to iterate through this to get one per day
    //Starting our data 8 data points out (one full day) and then moving to the next data entry another full day out
    //This will give us one entry per day for 5 days.
    for (var i = 7; i < data.list.length; i+=8) {

    var forecastData = data.list[i];

    // Data that we want returned from the 5-day forecast
    // We waant to be able to format this data in a cleaner way for the user
    var forecastDate = new Date(forecastData.dt_txt);

    // getting each individual date element that we want to use
    var year = forecastDate.getFullYear();
    // Have to add 1 here because getMonth returns starting at 0 (so we want January to display as 1, not 0)
    var month = forecastDate.getMonth() + 1;
    var date = forecastDate.getDate();

    // Making our gathered data into a single formatted string
    var formattedDate = month + '/' + date + '/' + year;

    var temperature = forecastData.main.temp;
    var windSpeed = forecastData.wind.speed;
    var humidity = forecastData.main.humidity;
    var weatherIcon = forecastData.weather[0].icon;

    //creating a card for each returned day's data
    var forecastCard = document.createElement('div');
    
    //Gathering date, will need to format better later on
    var dateEl = document.createElement('h3');
    dateEl.textContent = formattedDate;

    var temperatureEl = document.createElement('p');
    temperatureEl.textContent = 'Temperature: ' + temperature + '°F';

    var windEl = document.createElement('p');
    windEl.textContent = 'Wind Speed: ' + windSpeed + ' MPH';

    var humidityEl = document.createElement('p');
    humidityEl.textContent = 'Humidity: ' + humidity + '%';

    var weatherIconEl = document.createElement('img');
    weatherIconEl.src = "http://openweathermap.org/img/w/" + weatherIcon + ".png";

    //Appending new elements to card, and then to forecast section
    forecastCard.appendChild(dateEl);
    forecastCard.appendChild(weatherIconEl);
    forecastCard.appendChild(temperatureEl);
    forecastCard.appendChild(windEl);
    forecastCard.appendChild(humidityEl);

    forecastEl.appendChild(forecastCard);
    
    }
}

//Function to save search history to local storage
function saveSearchHistory(city) {
    // first getting local storage if any items exist, if not retrieveing an empty array
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    //checking to see if city already exists within local storage before adding
    if (searchHistory.indexOf(city) === -1) {
        //pushing searched city into searchHistory
        searchHistory.push(city);
        //setting search history with newly created data
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        //function that will display search history after new data is added
        showSearchHistory();
    }

}

//Function to display search history from local storage
function showSearchHistory() {
    var searchHistoryEl = document.getElementById('search-history-content');
    //setting element to empty string to clear out data
    searchHistoryEl.innerHTML = ''

    //retrieving search history from local storage
    var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    //itterating through each element in search history to display individually
    for (var i = 0; i < searchHistory.length; i++) {
        var cityName = searchHistory[i];
        //making the search history into a button so that it can be clicked to retrieve data again
        var historyItem = document.createElement('button');
        //setting button name to cityName
        historyItem.textContent = cityName;
        //adding an event to each button that will run getcoordinates function, with the text content used to make our API call again
        historyItem.addEventListener('click', function() {
            getCoordinates(this.textContent);
        });
        //Appending a button to our container for each element retrieved
        searchHistoryEl.appendChild(historyItem);
    }
}

showSearchHistory();
