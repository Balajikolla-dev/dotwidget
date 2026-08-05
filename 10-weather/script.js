(function () {
  'use strict';

  // Vancouver Coordinates
  const LAT = 49.2827;
  const LON = -123.1207;

  const DOM = {
    city: document.getElementById('city'),
    temp: document.getElementById('temp'),
    condition: document.getElementById('condition'),
    icon: document.getElementById('current-icon'),
    forecast: document.getElementById('forecast')
  };

  const WMO_CODES = {
    0: { desc: 'clear sky', icon: '☀️' },
    1: { desc: 'mainly clear', icon: '🌤️' },
    2: { desc: 'partly cloudy', icon: '⛅' },
    3: { desc: 'overcast', icon: '☁️' },
    45: { desc: 'foggy', icon: '🌫️' },
    61: { desc: 'slight rain', icon: '🌧️' },
    63: { desc: 'moderate rain', icon: '🌧️' },
    80: { desc: 'rain showers', icon: '🌦️' },
    95: { desc: 'thunderstorm', icon: '🌩️' }
  };

  const MOCK_DAILY = {
    time: ['2026-08-05', '2026-08-06', '2026-08-07', '2026-08-08', '2026-08-09', '2026-08-10', '2026-08-11'],
    weathercode: [0, 1, 2, 2, 3, 1, 0],
    temperature_2m_max: [24, 24, 23, 22, 20, 21, 21],
    temperature_2m_min: [14, 14, 14, 16, 16, 15, 16]
  };

  async function fetchWeather() {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      const data = await res.json();

      if (data.current_weather) {
        const code = data.current_weather.weathercode;
        const weatherInfo = WMO_CODES[code] || { desc: 'clear sky', icon: '☀️' };

        DOM.temp.textContent = Math.round(data.current_weather.temperature);
        DOM.condition.textContent = weatherInfo.desc;
        DOM.icon.textContent = weatherInfo.icon;
      }

      renderForecast(data.daily || MOCK_DAILY);
    } catch (err) {
      // Fallback display if API call fails
      DOM.temp.textContent = '18';
      DOM.condition.textContent = 'clear sky';
      DOM.icon.textContent = '☀️';
      renderForecast(MOCK_DAILY);
    }
  }

  function renderForecast(daily) {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let html = '';

    for (let i = 0; i < 7; i++) {
      const date = new Date(daily.time[i]);
      const dayLabel = dayNames[date.getDay()];
      const code = daily.weathercode[i];
      const icon = WMO_CODES[code]?.icon || '☀️';
      const high = Math.round(daily.temperature_2m_max[i]);
      const low = Math.round(daily.temperature_2m_min[i]);

      html += `
        <div class="forecast-day">
          <span class="day-name">${dayLabel}</span>
          <span class="day-icon">${icon}</span>
          <span class="high-temp">${high}°C</span>
          <span class="low-temp">${low}°C</span>
        </div>
      `;
    }

    DOM.forecast.innerHTML = html;
  }

  fetchWeather();
})();