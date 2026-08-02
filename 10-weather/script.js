const locationForm = document.getElementById('location-form');
const cityInput = document.getElementById('city-input');
const loadingEl = document.getElementById('weather-loading');
const contentEl = document.getElementById('weather-content');

const tempVal = document.getElementById('temp-val');
const conditionEl = document.getElementById('weather-condition');
const locationEl = document.getElementById('weather-location');
const iconEl = document.getElementById('weather-icon');
const humidityEl = document.getElementById('stat-humidity');
const windEl = document.getElementById('stat-wind');
const btnChange = document.getElementById('btn-change-location');

function getWeatherDetails(code) {
  if (code === 0) return { label: 'Clear Sky', icon: '☀️' };
  if (code >= 1 && code <= 3) return { label: 'Partly Cloudy', icon: '⛅' };
  if (code >= 45 && code <= 48) return { label: 'Foggy', icon: '🌫️' };
  if (code >= 51 && code <= 67) return { label: 'Rainy', icon: '🌧️' };
  if (code >= 71 && code <= 77) return { label: 'Snowy', icon: '❄️' };
  if (code >= 80 && code <= 82) return { label: 'Showers', icon: '🌦️' };
  if (code >= 95) return { label: 'Thunderstorm', icon: '⛈️' };
  return { label: 'Cloudy', icon: '☁️' };
}

// 1. Geocode city name to lat/long
async function searchCity(cityName) {
  locationForm.classList.add('hidden');
  loadingEl.classList.remove('hidden');

  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      alert('City not found. Please try again!');
      showForm();
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];
    const locationName = `${name}, ${country}`;

    // Save location to localStorage
    Storage.set('weather_location', { lat: latitude, lon: longitude, name: locationName });

    fetchWeather(latitude, longitude, locationName);
  } catch (err) {
    alert('Error searching city. Please check your connection.');
    showForm();
  }
}

// 2. Fetch live weather using coordinates
async function fetchWeather(lat, lon, locationName) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
    );
    const data = await response.json();
    const current = data.current;

    const weatherInfo = getWeatherDetails(current.weather_code);

    tempVal.textContent = Math.round(current.temperature_2m);
    conditionEl.textContent = weatherInfo.label;
    iconEl.textContent = weatherInfo.icon;
    humidityEl.textContent = `${current.relative_humidity_2m}%`;
    windEl.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    locationEl.textContent = locationName;

    loadingEl.classList.add('hidden');
    contentEl.classList.remove('hidden');
  } catch (err) {
    alert('Failed to load weather data.');
    showForm();
  }
}

function showForm() {
  loadingEl.classList.add('hidden');
  contentEl.classList.add('hidden');
  locationForm.classList.remove('hidden');
  cityInput.value = '';
  cityInput.focus();
}

// Form Submit Event
locationForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) searchCity(city);
});

// Reset Location Event
btnChange.addEventListener('click', showForm);

// Check if a location is already saved
const savedLoc = Storage.get('weather_location', null);
if (savedLoc) {
  fetchWeather(savedLoc.lat, savedLoc.lon, savedLoc.name);
} else {
  showForm();
}