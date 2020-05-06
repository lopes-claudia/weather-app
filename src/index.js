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

function showTemperature(response) {
  let cityText = document.querySelector("#city");
  let description = document.querySelector("#description");
  let currentTemp = document.querySelector("#temperature");
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind");
  let dateText = document.querySelector("#dateText");
  let hourText = document.querySelector("#hour");

  cityText.innerHTML = response.data.name;
  description.innerHTML = response.data.weather[0].main;
  currentTemp.innerHTML = `${Math.round(response.data.main.temp)}`;
  humidity.innerHTML = response.data.main.humidity;
  wind.innerHTML = `${Math.round(response.data.wind.speed)}`;
  dateText.innerHTML = formatDate(response.data.dt * 1000);
  hourText.innerHTML = formatHour(response.data.dt * 1000);
}

function search(city) {
  let apiKey = "c0e0b980f102072597435ae370a068d6";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(showTemperature);
}
function handleSubmit(event) {
  event.preventDefault();
  let cityName = document.querySelector("#cityInput");
  search(cityName.value);
}
let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

function showPositionTemp(response) {
  let currentCity = document.querySelector("#city");
  currentCity.innerHTML = response.data.name;
  let currentTemp = document.querySelector("#temperature");
  currentTemp.innerHTML = Math.round(response.data.main.temp);
  let description = document.querySelector("#description");
  description.innerHTML = response.data.weather[0].main;
}

function searchPosition(position) {
  let apiKey = "c0e0b980f102072597435ae370a068d6";
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${apiKey}`;
  axios.get(url).then(showPositionTemp);
}

function retrievePos(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchPosition);
}

let positionButton = document.querySelector("#currentLocalButton");
positionButton.addEventListener("click", retrievePos);

search("Lisbon");
