// Apps
function toggleApp(appId) {
  const app = document.getElementById(appId);
  const appIcon = document.getElementById(appId + 'Icon')
  const indicator = appIcon.querySelector('.indicator');
  const isVisible = app.style.display === 'block';

  app.style.display = isVisible ? 'none' : 'block';
  indicator.style.width = isVisible ? '0' : '50%';
  appIcon.style.backgroundColor = isVisible ? 'rgba(100, 100, 100, 0)' : 'rgba(100, 100, 100, 0.3)';
}

const dragElements = document.querySelectorAll('.app-window');
dragElements.forEach(el => {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  el.onmousedown = (e) => {
    e = e || window.event;
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  };

  function elementDrag(e) {
    e = e || window.event;
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    el.style.top = (el.offsetTop - pos2) + "px";
    el.style.left = (el.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
});

// Language Translations (wip)
function setLanguage(lang) {
  document.cookie = `language=${lang}; path=/`;
  updateLanguage();
}

function getLanguage() {
  const cookieArr = document.cookie.split("; ");
  const langCookie = cookieArr.find(row => row.startsWith("language="));
  return langCookie ? langCookie.split("=")[1] : "en";
}

function updateLanguage() {
  const lang = getLanguage();
  const elements = document.querySelectorAll('.app-window');

  elements.forEach(el => {
    const key = el.getAttribute("data-lang");
    el.innerText = translations[lang][key];
  });
}

const translations = {
  en: { "About Me": "About Me", "Skills": "Skills", "Projects": "Projects", "Contact Me": "Contact Me" },
  nl: { "About Me": "Over mij", "Skills": "Vaardigheden", "Projects": "Projecten", "Contact Me": "Contact Mij" },
};

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

async function updateWeather() {
  try {
    const locationResponse = await fetch('https://ipapi.co/json/');
    const locationData = await locationResponse.json();
    const { latitude, longitude } = locationData;

    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    const weatherData = await weatherResponse.json();

    const temperature = `${weatherData.current_weather.temperature}${weatherData.current_weather_units.temperature}`;
    const weatherCode = weatherData.current_weather.weathercode;
    const condition = weatherCodeDescriptions[weatherCode] || "Unknown weather condition";

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
  const popupTemperature = document.getElementById("popupTemperature");
  const popupCondition = document.getElementById("popupCondition");

  if (weatherPopup.classList.contains("show")) {
    weatherPopup.classList.remove("show");
  } else {
    popupTemperature.innerText = document.getElementById("temperature").innerText;
    popupCondition.innerText = document.getElementById("condition").innerText;
    weatherPopup.classList.add("show");
  }

  weatherIcon.classList.remove("jump-animation");
  void weatherIcon.offsetWidth; 
  weatherIcon.classList.add("jump-animation");
}




window.onload = () => {
  updateLanguage();
  updateWeather();
  updateTime();
};
