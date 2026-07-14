const input = document.getElementById('noteInput');
const list = document.getElementById('notesList');
const emptyMsg = document.getElementById('emptyMsg');
const timeNow = document.getElementById('timeNow');
const weatherNow = document.getElementById('weatherNow');

function updateClock(){
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes().toString().padStart(2,'0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  timeNow.textContent = `${h}:${m} ${ampm}`;
}
updateClock();
setInterval(updateClock, 1000 * 30);


const weatherCodes = {
  0: 'Clear', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Cloudy',
  45: 'Foggy', 48: 'Foggy',
  51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
  61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
  71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow',
  80: 'Rain Showers', 81: 'Rain Showers', 82: 'Heavy Showers',
  95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm'
};

function loadWeather(lat, lon){
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`)
      .then(res => res.json())
      .then(data => {
        const cw = data.current_weather;
        const label = weatherCodes[cw.weathercode] || 'Weather';
        weatherNow.textContent = `${label} ${Math.round(cw.temperature)}°C`;
      })
      .catch(() => { weatherNow.textContent = 'unavailable'; });
  }

if(navigator.geolocation){
  navigator.geolocation.getCurrentPosition(
    (pos) => loadWeather(pos.coords.latitude, pos.coords.longitude),
    () => { weatherNow.textContent = 'location off'; }
  );
} else {
  weatherNow.textContent = 'unavailable';
}

function refreshEmptyState(){
  const count = list.querySelectorAll('.note-item').length;
  emptyMsg.style.display = count === 0 ? 'block' : 'none';
}

function addNote(text){
  const item = document.createElement('div');
  item.className = 'note-item';

  const textSpan = document.createElement('span');
  textSpan.textContent = text;

  const time = document.createElement('span');
  time.className = 'time';
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes().toString().padStart(2,'0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  time.textContent = `${h}:${m}${ampm}`;

  const del = document.createElement('button');
  del.className = 'delete';
  del.textContent = '✕';
  del.addEventListener('click', () => {
    item.remove();
    refreshEmptyState();
  });

  const right = document.createElement('div');
  right.className = 'note-right';
  right.appendChild(time);
  right.appendChild(del);

  item.appendChild(textSpan);
  item.appendChild(right);

  list.prepend(item);
  refreshEmptyState();
}

input.addEventListener('keydown', (e) => {
  if(e.key === 'Enter' && !e.shiftKey){
    e.preventDefault();
    const text = input.value.trim();
    if(text.length > 0){
      addNote(text);
      input.value = '';
    }
  }
});

refreshEmptyState();