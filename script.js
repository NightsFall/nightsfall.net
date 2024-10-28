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

// Dragging function for app windows
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

// Language Translations
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
  const timeDateEl = document.getElementById('timeDate');
  timeDateEl.innerText = now.toLocaleString();
}
setInterval(updateTime, 1000);  // Update every second

// Placeholder Weather Data
function updateWeather() {
  // Replace this with actual API call for real data
  document.getElementById('weatherData').innerText = "25°C, Clear";
}
window.onload = () => {
  updateLanguage();
  updateWeather();
};
