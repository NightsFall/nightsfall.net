// Apps
function toggleApp(appId) {
  const app = document.getElementById(appId);
  app.style.display = app.style.display === "block" ? "none" : "block";
}

// Make apps draggable
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

// Language management with cookies
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

// Translations
const translations = {
  en: { "About Me": "About Me", "Skills": "Skills", "Projects": "Projects", "Contact Me": "Contact Me" },
  es: { "About Me": "Overmij", "Skills": "Vaardigheden", "Projects": "Projecten", "Contact Me": "Contact Mij" },
};

window.onload = updateLanguage;