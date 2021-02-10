//variable declaration
//getting html elements and storing in variable for DOM manipulation
var userCityInput = document.querySelector("#city-input");
var searchButton = document.querySelector("#search-btn");
var search = document.getElementById("search-btn");
var weatherDiv = document.getElementById("weather-card");
var fiveDay = document.getElementById("five-day-card");
var cityList = document.getElementById("city-list");
var cityLog = [];
var cityId = "";

//call the function so user's previously searched cities will display upon loading the page
getLocalStorage();

//adding event listener on the search button so that when they press search the apiCall and getLocalStorage functions are run
//apiCal is run via inputted city below and the city is added to localstorage
searchButton.addEventListener("click", function (event) {
	event.preventDefault();
	cityId = userCityInput.value.trim();
	cityLog.push(cityId);
	localStorage.setItem("cityStorage", JSON.stringify(cityLog));
	apiCall();
	getLocalStorage();
});
//setting local storage
if (localStorage.getItem("cityStorage") !== null) {
	cityLog = JSON.parse(localStorage.getItem("cityStorage"));
	localStorage.setItem("cityStorage", JSON.stringify(cityLog));
	cityId = cityLog[cityLog.length - 1];
	// getweather();
}
//function for showing weather for previously searched cities
if (localStorage.getItem("cityStorage") !== null) {
	cityList.addEventListener("click", function (event) {
		event.preventDefault();
		cityId = event.target.textContent;
		apiCall();
	});
}

function apiCall() {
	//api URL, concattination the user searched city
	var requestURL =
		"https://api.openweathermap.org/data/2.5/weather?q=" +
		cityId +
		"&APPID=942110492ba0d007f868aae5235efe52&units=imperial";
	fetch(requestURL)
		.then(function (response) {
			if (response.ok) {
				//console.log(response);
				response.json().then(function (data) {
					console.log(data);
					//creating elements
					var date = new Date().toISOString().slice(0, 10);
					var cityHead = document.createElement("h2");
					var weatherIcon = document.createElement("img");
					var tempData = document.createElement("p");
					var humidityData = document.createElement("p");
					var windSpeedData = document.createElement("p");
					var latitude = data.coord.lat;
					var longitude = data.coord.lon;
					//weather icon URL
					weatherIcon.setAttribute(
						"src",
						"https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
					);
					cityHead.textContent = data.name + " " + "(" + date + ")";
					tempData.textContent = "Temperature: " + data.main.temp;
					humidityData.textContent = "Humidity: " + data.main.humidity + "%";
					windSpeedData.textContent = "Wind Speed: " + data.wind.speed + " MPH";
					//appending to card
					weatherDiv.appendChild(cityHead);
					weatherDiv.appendChild(weatherIcon);
					weatherDiv.appendChild(tempData);
					weatherDiv.appendChild(humidityData);
					weatherDiv.appendChild(windSpeedData);
					//uv 
					var uvURL =
						"https://api.openweathermap.org/data/2.5/uvi?lat=" +
						latitude +
						"&lon=" +
						longitude +
						"&appid=942110492ba0d007f868aae5235efe52";

					fetch(uvURL).then(function (response) {
						if (response.ok) {
							response.json().then(function (data) {
								var uvValue = data.value;
								var uvData = document.createElement("p");
								uvData.textContent = "UV Index : " + uvValue;
								weatherDiv.appendChild(uvData);

								//uv colors
								if (uvValue <= 2) {
									uvData.setAttribute("style", "color: green;");
								} else if (uvValue > 2 && uvValue <= 5) {
									uvData.setAttribute("style", "color: yellow;");
								} else if (uvValue > 5 && uvValue <= 8) {
									uvData.setAttribute("style", "color: orange;");
								} else if (uvValue > 8) {
									uvData.setAttribute("style", "color: red;");
								}
							});
						}
					});
					//five day forecast 
					var fiveDayURL =
						"https://api.openweathermap.org/data/2.5/onecall?lat=" +
						latitude +
						"&lon=" +
						longitude +
						"&exclude=hourly,minutely&units=imperial&appid=942110492ba0d007f868aae5235efe52&units=imperial";

					fetch(fiveDayURL).then(function (response) {
						if (response.ok) {
							response.json().then(function (data) {
								console.log(data);
								for (i = 0; i < 6; i++) {
									var perDayCard = document.createElement("div");
									perDayCard.setAttribute("class", "card-body col-md-2");
									// perDayCard.setAttribute("style", "width: 25px;");
									perDayCard.setAttribute("style", "float: left;");

									fiveDay.appendChild(perDayCard);
									var perDayImage = document.createElement("img");
									perDayImage.setAttribute(
										"src",
										"https://openweathermap.org/img/w/" +
											data.daily[i].weather[0].icon +
											".png"
									);
									perDayCard.appendChild(perDayImage);

									var perDate = document.createElement("h6");
									perDate.textContent = new Date(
										data.daily[i].dt * 1000
									).toLocaleString();
									perDayCard.appendChild(perDate);

									var perDayTemp = document.createElement("h6");
									perDayTemp.textContent = "Temp " + data.daily[i].temp.day;
									perDayCard.appendChild(perDayTemp);

									var perDayHumid = document.createElement("h6");
									perDayHumid.textContent =
										"Humidity: " + data.daily[i].humidity + "%";
									perDayCard.appendChild(perDayHumid);
								}
							});
						}
					});
				});
			} else {
				alert("Error: " + response.statusText);
			}
		})
		.catch(function (error) {
			alert("Unable to connect to Weather app");
		});
}
//previously searched cities 
function getLocalStorage() {
	cityList.innerHTML = "";
	cityObject = JSON.parse(localStorage.getItem("cityStorage"));
	if (localStorage.getItem("cityStorage") !== null) {
		for (var j = 0; j < cityObject.length; j++) {
			var prevCities = document.createElement("p");
			prevCities.textContent = cityObject[j];
			prevCities.setAttribute("style", "text-decoration: underline;");
			cityList.appendChild(prevCities);
		}
	}
}

// searchButton.addEventListener("click", function (event) {
// 	event.preventDefault();
// 	cityId = userCityInput.value.trim();
// 	cityLog.push(cityId);
// 	localStorage.setItem("cityStorage", JSON.stringify(cityLog));
// 	apiCall();
// });
