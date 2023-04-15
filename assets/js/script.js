// Global variables
var searchTerm = document.querySelector("#myCity");
var searchForm = document.querySelector(".submit-search");
var searchHistoryArr = [];

/* to get the latitude and longtitude of the city  */
var getCoords = function (city) {
  console.log(city);
  var geoUrl =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=5&appid=bd781bdf88957dbac055696eb9416ac7";

  fetch(geoUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          var latitude = data[0].lat;
          var longitude = data[0].lon;
          getForecast(latitude, longitude);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Open Weather");
    });
};

// function to display searched city name on HTML
function displayCityName() {
  var cityTitle = document.getElementById("cityTitle");
  var cityArray = localStorage.getItem("cityNames");
  var searchHistoryArr = [];

  if (cityArray) {
    searchHistoryArr = JSON.parse(cityArray);
  }

  var lastCity = searchHistoryArr.slice(-1)[0];
  cityTitle.textContent = lastCity;

}

// function to display searched cities on HTML
function displaySearchHistory() {
  var searchHistoryEl = document.querySelector("#search-history");

  var storedCity = localStorage.getItem("cityNames");
  if (storedCity) {
    searchHistoryArr = JSON.parse(storedCity);

    var lastItem = searchHistoryArr.slice(-1)[0];
    // Create a button element
    var buttonEl = document.createElement("button");
    buttonEl.textContent = lastItem;
    buttonEl.setAttribute("data-city", lastItem);

    // Add a click event listener to the button
    buttonEl.addEventListener("click", function (event) {
      var cityName = event.target.getAttribute("data-city");
      var cityTitle = document.getElementById("cityTitle")
      cityTitle.textContent = cityName;
      getCoords(cityName);
    });

    // // Append the button to the list item
    buttonEl.style.width = "200px"; // sets button width
    buttonEl.style.width = "200px"; // sets button height
    buttonEl.style.background = "wheat"; // sets button background to wheat
    buttonEl.style.color = "red"; // sets button text to red
    buttonEl.style.fontSize = "20px"; // sets button font size to 20px

    // Append the list item to the search history element
    searchHistoryEl.appendChild(buttonEl);
  }
}

// function to add searched city to local storage 
// also displays functions(SearchHistory & CityName) on button click
function handleFormSubmit(event) {
  event.preventDefault();
  var cityName = searchTerm.value.trim();
  searchHistoryArr.push(cityName);
  localStorage.setItem("cityNames", JSON.stringify(searchHistoryArr));
  displaySearchHistory();
  displayCityName();
  getCoords(cityName);
}

/* getForecast will use the coordinates from the getCoord function */
var getForecast = function (latitude, longitude) {
  var weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=bd781bdf88957dbac055696eb9416ac7`;
  fetch(weatherUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          // console.log(data) // TODO: delete this before submitting
          let todayForecastArray = [];
          let forecastArray = [];
          for (let i = 0; i < data.list.length; i++) {
            var forecastObject = data.list[i];
            var objectDate = new Date(forecastObject.dt_txt);
            var todayDate = new Date();
            if (objectDate.getDate() === todayDate.getDate()) {
              // if the dates match, push the object to todayForecastArray
              if (todayForecastArray.length === 0) {
                todayForecastArray.push(forecastObject);
              }
            }

            var testTime = forecastObject.dt_txt.split(" ")[1];
            if (testTime === "12:00:00") {
              forecastArray.push(forecastObject);
            }
          }
          displayForecast(forecastArray);
          displayTodayForecast(todayForecastArray);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Weatherorg");
    });
};

// var function to display todays forecast
var displayTodayForecast = function (array) {
  var todayContainerEl = document.getElementById("today-container");
  todayContainerEl.innerHTML = "";
  array.forEach(function (day) {
    /* create weather card element which will contain weather info for each day */
    TodayCardEl = document.createElement("div");
    TodayCardEl.setAttribute("id", "today-card");

    /* date element */
    var todayDateEl = document.createElement("h3");
    todayDateEl.setAttribute("id", "todaydate-header");
    /* weather data element */
    var todayTemperatureEl = document.createElement("p");
    var todayHumidityEl = document.createElement("p");
    var todayWindEl = document.createElement("p");
    var todayImageEl = document.createElement("img");

    /* rendering the date on html */
    var dateArr = day.dt_txt.split(" ")[0].split("-");
    var date = dateArr[2] + "/" + dateArr[1];
    todayDateEl.textContent = date;
    console.log(day.weather[0]);
    /* weather image */
    todayImageEl.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`
    );

    /* rendering weather data on html */
    todayTemperatureEl.textContent = "Temperature: " + day.main.temp + "°C";
    todayHumidityEl.textContent = "Humidity: " + day.main.humidity + "%";
    todayWindEl.textContent = "Wind: " + day.wind.speed + "km/h";

    /* appending newly created element into weather container */
    TodayCardEl.append(
      todayDateEl,
      todayImageEl,
      todayTemperatureEl,
      todayHumidityEl,
      todayWindEl
    );
    todayContainerEl.appendChild(TodayCardEl);
  });
};

/* to render the weather forecast on the index.html page */
var displayForecast = function (array) {
  var weatherContainerEl = document.getElementById("weather-container");
  weatherContainerEl.innerHTML = "";
  array.forEach(function (day) {
    /* create weather card element which will contain weather info for each day */
    weatherCardEl = document.createElement("div");
    weatherCardEl.setAttribute("id", "weather-card");

    /* date element */
    var dateEl = document.createElement("h3");
    dateEl.setAttribute("id", "date-header");
    /* weather data element */
    var temperatureEl = document.createElement("p");
    var humidityEl = document.createElement("p");
    var windEl = document.createElement("p");
    var imageEl = document.createElement("img");

    /* rendering the date on html */
    var dateArr = day.dt_txt.split(" ")[0].split("-");
    var date = dateArr[2] + "/" + dateArr[1];
    dateEl.textContent = date;
    console.log(day.weather[0]);
    /* weather image */
    imageEl.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`
    );

    /* rendering weather data on html */
    temperatureEl.textContent = "Temperature: " + day.main.temp + "°C";
    humidityEl.textContent = "Humidity: " + day.main.humidity + "%";
    windEl.textContent = "Wind: " + day.wind.speed + "km/h";

    /* appending newly created element into weather container */
    weatherCardEl.append(dateEl, imageEl, temperatureEl, humidityEl, windEl);
    weatherContainerEl.appendChild(weatherCardEl);
  });
};

// on button click runs handleFormSubmit to display
// everything on the HTML page
searchForm.addEventListener("submit", handleFormSubmit);
