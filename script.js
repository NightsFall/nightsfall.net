// Apps
function toggleApp(appId) {
  const appWindow = document.getElementById(appId);
  const appIcon = document.getElementById(appId + 'Icon');
  const indicator = appIcon.querySelector('.indicator');
  
  // Check if the app window is currently visible
  const isVisible = appWindow.classList.contains("active");

  if (isVisible) {
    // Hide the app window
    appWindow.classList.remove("active");
    // Delay setting display to 'none' until the animation completes
    setTimeout(() => {
      appWindow.style.display = "none";
    }, 300); // Match the duration of the CSS transition

    // Update app icon state
    indicator.style.width = '0'; // Hide indicator
    appIcon.style.backgroundColor = 'transparent'; // Reset background color
  } else {
    // Show the app window
    appWindow.style.display = "block";
    // Small timeout to allow display block to register before the animation
    setTimeout(() => {
      appWindow.classList.add("active");
    }, 10);
    
    // Update app icon state
    indicator.style.width = '50%'; // Show indicator
    appIcon.style.backgroundColor = 'rgba(35, 35, 35, 0.3)'; // Set background color
  }
}


var PADDING = 8;

var rect;
var viewport = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 0
}

const dragElements = document.querySelectorAll('.app-window');
dragElements.forEach(elmnt => {
  const header = elmnt.querySelector('.app-header');
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  if (header) {
    header.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    
    const newTop = elmnt.offsetTop - pos2;
    const newLeft = elmnt.offsetLeft - pos1;

    if (newTop >= PADDING && newTop + elmnt.offsetHeight <= window.innerHeight - PADDING) {
      elmnt.style.top = newTop + "px";
    }
    if (newLeft >= PADDING && newLeft + elmnt.offsetWidth <= window.innerWidth - PADDING) {
      elmnt.style.left = newLeft + "px";
    }
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
});

// Background
function changeBackground(image) {
  document.body.style.backgroundImage = `url(${image})`;
}

// Time and Date
function updateTime() {
  const now = new Date();
  const timeDisplay = document.getElementById('timeDisplay');
  const dateDisplay = document.getElementById('dateDisplay');
  
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = now.toLocaleDateString();

  timeDisplay.innerText = timeString;
  dateDisplay.innerText = dateString;
}
setInterval(updateTime, 1000);

// Weather
const weatherCodeDescriptions = {
  0: "Clear Sky",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Eime Fog",
  51: "Light Drizzle",
  53: "Drizzle",
  55: "Heavy Drizzle",
  56: "Light Freezing Drizzle",
  57: "Freezing Drizzle",
  61: "Light Rain",
  63: "Moderate Rain",
  65: "Heavy Rain",
  66: "Light Freezing Rain",
  67: "Freezing Rain",
  71: "Light Snowfall",
  73: "Snowfall",
  75: "Heavy Snowfall",
  77: "Snow Grains",
  80: "Light Showers",
  81: "Showers",
  82: "Heavy Showers",
  85: "Light Snow Showers",
  86: "Snow Showers",
  95: "Thunderstorm",
  96: "Light Thunderstorm with Hail",
  99: "Thunderstorm with Hail"
};

let weatherLastUpdated;
let temperature;
let apparentTemperature;
let weatherCode;
let condition;
let precipitation;
let humidity;
let cloudCover;
let city;

async function updateWeather() {
  try {
    const locationResponse = await fetch('https://ipapi.co/json/');
    const locationData = await locationResponse.json();
    const { latitude, longitude } = locationData;
    city = locationData.city;

    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&timezone=auto`);
    const weatherData = await weatherResponse.json();

    console.log(weatherData)

    weatherLastUpdated = weatherData.current.time.split('T')[1];
    temperature = `${weatherData.current.temperature_2m}${weatherData.current_units.temperature_2m}`;
    apparentTemperature = `${weatherData.current.apparent_temperature}${weatherData.current_units.apparent_temperature}`;
    weatherCode = weatherData.current.weather_code;
    condition = weatherCodeDescriptions[weatherCode] || "Unknown weather condition";
    precipitation = `${weatherData.current.precipitation}${weatherData.current_units.precipitation}`;
    humidity = `${weatherData.current.relative_humidity_2m}${weatherData.current_units.relative_humidity_2m}`;
    cloudCover = `${weatherData.current.cloud_cover}${weatherData.current_units.cloud_cover}`;

    document.getElementById('temperature').innerText = temperature;
    document.getElementById('condition').innerText = condition;

    const weatherIcon = document.getElementById('weatherIcon');
    weatherIcon.src = `./assets/weather/${weatherCode}.png`;
    weatherIcon.alt = condition;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    document.getElementById('temperature').innerText = "N/A";
    document.getElementById('condition').innerText = "Unable to retrieve weather data";
  }
}

function toggleWeather() {
  const weatherPopup = document.getElementById("weatherPopup");
  const weatherIcon = document.getElementById("weatherIcon");
  const popupWeatherIcon = document.getElementById("popupWeatherIcon");

  if (weatherPopup.classList.contains("show")) {
    weatherPopup.classList.remove("show");
  } else {
    document.getElementById("popupLocation").innerText = city;
    document.getElementById("popupTemperature").innerText = temperature;
    document.getElementById("popupApparentTemperature").innerText = `feels like ${apparentTemperature}`;
    popupWeatherIcon.src = `./assets/weather/${weatherCode}.png`;
    popupWeatherIcon.alt = condition;
    document.getElementById("popupCondition").innerText = condition;
    document.getElementById("popupPrecipitation").innerText = precipitation;
    document.getElementById("popupHumidity").innerText = humidity;
    document.getElementById("popupCloudCover").innerText = cloudCover;
    document.getElementById("popupLastUpdated").innerText = `Updated: ${weatherLastUpdated}`;
    weatherPopup.classList.add("show");
  }

  weatherIcon.classList.remove("jump-animation");
  void weatherIcon.offsetWidth; 
  weatherIcon.classList.add("jump-animation");
}


function closeWeatherPopup() {
  if (weatherPopup.classList.contains("show")) {
    weatherPopup.classList.remove("show");
  }
}

document.addEventListener("click", function(event) {
  if (!weatherPopup.contains(event.target) && !event.target.closest("#weather")) {
    closeWeatherPopup();
  }
});

window.onload = () => {
  updateWeather();
  updateTime();
};
