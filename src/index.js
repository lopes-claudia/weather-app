function formatDate(timestamp) {
  let now = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let day = days[now.getDay()];
  let month = months[now.getMonth()];
  let date = now.getDate();
  return `${day}, ${month} ${date}`;
}

function formatHour(timestamp) {
  let now = new Date(timestamp);
  let hours = now.getHours();
  let minutes = now.getMinutes();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hours < 10) {
    hours = `0${hours}`;
  }
  return `${hours}:${minutes}`;
}

function showData(response) {
  let cityText = document.querySelector("#city");
  let description = document.querySelector("#description");
  let currentTemp = document.querySelector("#temperature");
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind");
  let dateText = document.querySelector("#dateText");
  let hourText = document.querySelector("#hour");
  let iconElement = document.querySelector("#icon");
  celsiusTemperature = response.data.main.temp;

  cityText.innerHTML = response.data.name;
  description.innerHTML = response.data.weather[0].description;
  currentTemp.innerHTML = Math.round(celsiusTemperature);
  humidity.innerHTML = response.data.main.humidity;
  wind.innerHTML = `${Math.round(response.data.wind.speed)}`;
  dateText.innerHTML = formatDate(response.data.dt * 1000);
  hourText.innerHTML = formatHour(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].main);
}

function displayForecast(response) {
  let forecastSection = document.querySelector("#weather-forecast");
  let forecast = null;
  forecastSection.innerHTML = null;

  for (let i = 0; i <= 5; i++) {
    forecast = response.data.list[i];
    forecastSection.innerHTML += `<div class="col-2 hourForecast">
    <h5>${formatHour(forecast.dt * 1000)}</h5>
    <img src="http://openweathermap.org/img/wn/${
      forecast.weather[0].icon
    }@2x.png" id="icon-forecast" />
    <div class="forecastTemperature">
    <strong><span class="max" id="max${i}"> </span>º</strong>|
    <span class="min" id="min${i}"></span><span class="min">º</span>
    </div>
    </div>`;

    let maxForecastElement = document.querySelector(`#max${i}`);
    let minForecastElement = document.querySelector(`#min${i}`);
    maxForecastElement.innerHTML = `${Math.round(forecast.main.temp_max)}`;
    minForecastElement.innerHTML = `${Math.round(forecast.main.temp_min)}`;
  }
}

function search(city) {
  let apiKey = "c0e0b980f102072597435ae370a068d6";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(showData);
  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityName = document.querySelector("#cityInput");
  celsius.classList.add("active");
  fahrLink.classList.remove("active");
  search(cityName.value);
  cityName.value = "";
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

function searchPosition(position) {
  let apiKey = "c0e0b980f102072597435ae370a068d6";
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${apiKey}`;
  axios.get(url).then(showData);
  celsius.classList.add("active");
  fahrLink.classList.remove("active");

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function retrievePos(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchPosition);
}

let positionButton = document.querySelector("#currentLocalButton");
positionButton.addEventListener("click", retrievePos);

function showFahrTemp(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#temperature");
  let fahrTemperature = (celsiusTemperature * 9) / 5 + 32;
  currentTemp.innerHTML = Math.round(fahrTemperature);

  celsius.classList.remove("active");
  fahrLink.classList.add("active");

  for (let i = 0; i <= 5; i++) {
    let maxForecastElement = document.querySelector(`#max${i}`);
    max_celsius = maxForecastElement.innerHTML;
    maxForecastElement.innerHTML = Math.round((max_celsius * 9) / 5 + 32);

    let minForecastElement = document.querySelector(`#min${i}`);
    min_celsius = minForecastElement.innerHTML;
    minForecastElement.innerHTML = Math.round((min_celsius * 9) / 5 + 32);
  }

  fahrLink.removeEventListener("click", showFahrTemp);
  celsiusLink.addEventListener("click", showCelsiusTemp);
}

function showCelsiusTemp(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#temperature");
  currentTemp.innerHTML = Math.round(celsiusTemperature);
  celsius.classList.add("active");
  fahrLink.classList.remove("active");

  for (let i = 0; i <= 5; i++) {
    let maxForecastElement = document.querySelector(`#max${i}`);
    max_fahr = maxForecastElement.innerHTML;
    maxForecastElement.innerHTML = Math.round((max_fahr - 32) * (5 / 9));

    let minForecastElement = document.querySelector(`#min${i}`);
    min_fahr = minForecastElement.innerHTML;
    minForecastElement.innerHTML = Math.round((min_fahr - 32) * (5 / 9));
  }

  celsiusLink.removeEventListener("click", showCelsiusTemp);
  fahrLink.addEventListener("click", showFahrTemp);
}

let celsiusTemperature = null;

let fahrLink = document.querySelector("#fahr");
fahrLink.addEventListener("click", showFahrTemp);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", showCelsiusTemp);

search("Lisbon");
