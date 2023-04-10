var searchTerm = document.querySelector('#myCity')
var searchForm = document.querySelector('.submit-search')
var searchHistoryArr = []

/* to get the latitude and longtitude of the city  */
var getCoords = function (city) {
  console.log(city)
    var geoUrl =
        "https://api.openweathermap.org/geo/1.0/direct?q=" +
        city +
        "&limit=5&appid=bd781bdf88957dbac055696eb9416ac7";
  
    // console.log("GeoURL: " + geoUrl); // TODO: delete this before submitting
      fetch(geoUrl)
        .then(function (response) {
          // console.log(response); // TODO: delete this before submitting
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
// to show localstorage, create a div container, say getitem, show history
  function handleFormSubmit(event){
    event.preventDefault()
    var cityName = searchTerm.value.trim()
    searchHistoryArr.push(cityName)
    localStorage.setItem('cityNames', searchHistoryArr)
    getCoords(cityName)
  }
  
  // getCoords(city);
  
    /* getForecast will use the coordinates from the getCoord function */
    var getForecast = function (latitude, longitude) {
      var weatherUrl =
        "https://api.openweathermap.org/data/2.5/forecast?lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&units=metric&appid=bd781bdf88957dbac055696eb9416ac7";
      fetch(weatherUrl)
        .then(function (response) {
          if (response.ok) {
            response.json().then(function (data) {
                // console.log(data) // TODO: delete this before submitting
                let forecastArray = []
            for (let i = 0; i < data.list.length; i++) {
                var forecastObject = data.list[i];
    
                var testTime = forecastObject.dt_txt.split(" ")[1]
                if(testTime==="12:00:00") {
                    forecastArray.push(forecastObject)
                }
                
            }
            displayForecast(forecastArray)
            });
          } else {
            alert("Error: " + response.statusText);
          }
        })
        .catch(function (error) {
          alert("Unable to connect to Weatherorg");
        });
    };
    
    /* to render the weather forecast on the destinations.html page */
    var displayForecast = function(array) {
      var weatherContainerEl = document.getElementById('weather-container');
      weatherContainerEl.innerHTML = "";
      array.forEach(function(day){
  
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
        console.log(day.weather[0])
        /* weather image */
        imageEl.setAttribute('src', `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`)
        // imageEl.src = "https://openweathermap.org/img/wn/"+ day.weather[0].icon 
          
        /* rendering weather data on html */
        temperatureEl.textContent = "Temperature: " + day.main.temp + "°C";
        humidityEl.textContent = "Humidity: " + day.main.humidity + "%";
        windEl.textContent = "Wind: " + day.wind.speed + "km/h";
  
        /* appending newly created element into weather container */
        weatherCardEl.append(dateEl, imageEl, temperatureEl, humidityEl, windEl);
        weatherContainerEl.appendChild(weatherCardEl);
      })  
    }


    searchForm.addEventListener('submit', handleFormSubmit)