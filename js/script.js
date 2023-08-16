let nextDaysContainer = document.getElementById("nextDaysContainer");
let detectLocation = document.getElementById("detectLocation");
let data = [];
let locationData = [];
changeForecastData("alexandria");
changeCurrentData("alexandria");
async function getApiData(cityName) {
  let https = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=8f3ffe1b20644d88ba9185956231408&q=${cityName}&days=4`
  );
  let response = await https.json();
  data = response;
}
async function changeForecastData(value) {
  await getApiData(value);
  locationName.children[1].innerHTML = data.location.name;
  let container = "";
  let arr = data.forecast.forecastday;
  for (let i = 1; i < arr.length; i++) {
    container += `
    <div class ="col-lg-4">  
             <div
                      class="forecast  p-4 rounded-4 d-flex justify-content-center  align-items-center flex-column text-light w-100"
                   >
                      <p class="date fs-4 fw-normal">${
                        changeDateStyle(arr[i].date).allDate
                      }</p>
                      <div
                        class="weather-degree d-flex justify-content-center align-items-center column-gap-1"
                      >
                        <h3>${arr[i].day.avgtemp_c}&degC</h3>
                        <img src="${
                          arr[i].day.condition.icon
                        }" alt="forecast-image"
                        />
                      </div>
                      <h4>${arr[i].day.mintemp_c}&degC</h4>
                      <span>${arr[i].day.condition.text}</span>
                    </div>
                    </div>`;
  }
  nextDaysContainer.innerHTML = container;
}
async function changeCurrentData(value) {
  await getApiData(value);
  let date = document.querySelector(".date");
  let currentDegree = document.querySelector(".current-degree");
  let weatherCondition = document.querySelector(".weather-condition");
  let currentImg = document.querySelector(".currentImg");
  let rain = document.querySelector(".rain");
  let wind = document.querySelector(".wind");
  let direction = document.querySelector(".direction");
  let cloud = document.querySelector(".cloud");
  let pressure = document.querySelector(".pressure");
  let humidity = document.querySelector(".humidity");
  let currentDate = changeDateStyle(data.location.localtime);
  date.innerHTML = " Today - " + currentDate.allDate + " - " + currentDate.hour;
  currentDegree.innerHTML = data.current.temp_c + "&degC";
  weatherCondition.innerHTML = data.current.condition.text;
  currentImg.setAttribute("src", data.current.condition.icon);
  rain.innerHTML = data.current.precip_mm + "&#37";
  wind.innerHTML = data.current.wind_kph + "km/h";
  direction.innerHTML = data.current.wind_dir;
  cloud.innerHTML = data.current.cloud + "&#37";
  pressure.innerHTML = data.current.pressure_mb + "mb";
  humidity.innerHTML = data.current.humidity + "&#37";
}
function changeDateStyle(dateOfForecast) {
  let day = new Date(dateOfForecast);
  day = day.toLocaleString("en-us", {
    weekday: "long",
    month: "long",
    day: "2-digit",
    hour: "numeric",
  });
  let allDate = day.split(" at ")[0].split(",").join(" - ");
  let hour = day.split("at")[1];
  return { allDate, hour };
}
searchInput.addEventListener("input", () => {
  changeForecastData(searchInput.value);
  changeCurrentData(searchInput.value);
});
async function getLocationData(lat, lon) {
  let response = await fetch(
    `https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}`
  );
  locationData = await response.json();
}
async function showLocation() {
  await changeForecastData(locationData.address.city);
  await changeCurrentData(locationData.address.city);
}
detectLocation.addEventListener("click", function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async function (position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      await getLocationData(latitude, longitude);
      showLocation();
      clearInputs();
    });
  }
});
function clearInputs() {
  searchInput.value = "";
}
