/**
 * WeatherNow – Real-Time Weather Dashboard
 * Main Application Controller
 *
 * Implements all 15 mandatory functions:
 *  1. initializeApp()
 *  2. searchCity(cityName)
 *  3. getCoordinates(cityName)
 *  4. fetchWeather(lat, lon, timezone)
 *  5. displayCurrentWeather(data, cityInfo)
 *  6. displayWeatherDetails(data)
 *  7. displayHourlyForecast(data)
 *  8. displayDailyForecast(data)
 *  9. getWeatherDescription(code, isDay)
 * 10. getWeatherIcon(code, isDay)
 * 11. convertTemperature(celsius, unit)
 * 12. saveFavoriteCity(cityInfo)
 * 13. loadFavoriteCities()
 * 14. saveSearchHistory(cityName)
 * 15. handleAPIError(error, context)
 */

// Application State
const state = {
  currentCity: null,        // Currently viewed city metadata
  weatherData: null,        // Latest raw Open-Meteo API response
  temperatureUnit: 'C',     // 'C' (Celsius) or 'F' (Fahrenheit)
  theme: 'dark',            // 'dark' or 'light'
  favorites: [],            // Array of favorite city objects
  recentSearches: [],       // Array of recently searched city strings
  abortController: null     // Current in-flight search AbortController
};

// Storage Keys
const STORAGE_KEYS = {
  UNIT: 'weathernow_unit',
  THEME: 'weathernow_theme',
  FAVORITES: 'weathernow_favorites',
  RECENTS: 'weathernow_recent_searches',
  LAST_CITY: 'weathernow_last_city'
};

/* --------------------------------------------------------------------------
   FUNCTION 1: initializeApp()
   -------------------------------------------------------------------------- */
/**
 * Bootstraps the application, registers DOM listeners, and loads initial weather.
 */
function initializeApp() {
  // 1. Restore Theme preference
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  setAppTheme(savedTheme);

  // 2. Restore Temperature unit preference
  const savedUnit = localStorage.getItem(STORAGE_KEYS.UNIT) || 'C';
  setTemperatureUnit(savedUnit, false);

  // 3. Update current date badge & footer year
  updateDateBadges();

  // 4. Load persisted favorites and recent searches
  loadFavoriteCities();
  loadRecentSearches();

  // 5. Register all event listeners
  setupEventListeners();

  // 6. Load initial city (Saved last city OR default to 'Chennai')
  const lastCity = localStorage.getItem(STORAGE_KEYS.LAST_CITY) || 'Chennai';
  searchCity(lastCity);
}

/* --------------------------------------------------------------------------
   FUNCTION 2: searchCity(cityName)
   -------------------------------------------------------------------------- */
/**
 * Orchestrates city search workflow: validation -> geocoding -> weather -> DOM.
 * @param {string} cityName - Name of the city entered by user.
 */
async function searchCity(cityName) {
  // 1. Input Validation
  const trimmed = cityName ? cityName.trim() : '';
  if (!trimmed) {
    showAlert('Please enter a city name to search.', 'warning');
    return;
  }

  // 2. Abort any previous pending search to prevent race conditions
  if (state.abortController) {
    state.abortController.abort();
  }
  state.abortController = new AbortController();
  const { signal } = state.abortController;

  // 3. UI Loading State
  showLoading(true, `Searching weather for "${trimmed}"...`);
  hideAlert();

  try {
    // 4. Step 1: Geocoding API Request
    const location = await getCoordinates(trimmed, signal);

    // 5. Step 2: Weather Forecast API Request
    const weatherData = await fetchWeather(
      location.latitude,
      location.longitude,
      location.timezone,
      signal
    );

    // 6. Update Application State
    state.currentCity = location;
    state.weatherData = weatherData;

    // 7. Render All Sections to DOM
    displayCurrentWeather(weatherData, location);
    displayWeatherDetails(weatherData);
    displayHourlyForecast(weatherData);
    displayDailyForecast(weatherData);

    // 8. Update Favorite Button active state
    updateFavoriteButtonState();

    // 9. Persist to Recent Searches & Last City
    saveSearchHistory(location.name);
    localStorage.setItem(STORAGE_KEYS.LAST_CITY, location.name);

    // 10. Clear search input on success
    const searchInput = document.getElementById('city-search-input');
    if (searchInput) {
      searchInput.value = '';
      toggleSearchClearBtn(false);
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      // Ignored: new search took precedence
      return;
    }
    const userMessage = handleAPIError(error, 'searchCity');
    showAlert(userMessage, 'error');
  } finally {
    showLoading(false);
  }
}

/* --------------------------------------------------------------------------
   FUNCTION 3: getCoordinates(cityName, [signal])
   -------------------------------------------------------------------------- */
/**
 * Resolves city coordinates from Open-Meteo Geocoding REST API.
 * @param {string} cityName - City query string.
 * @param {AbortSignal} [signal] - Abort signal.
 * @returns {Promise<Object>} Location metadata object.
 */
async function getCoordinates(cityName, signal = null) {
  // If window.getCoordinates from api.js is available, delegate to it
  if (typeof window !== 'undefined' && typeof window.getCoordinates === 'function' && window.getCoordinates !== getCoordinates) {
    return window.getCoordinates(cityName, signal);
  }

  const aliases = {
    'thiruvannamalai': 'Tiruvannamalai',
    'bangalore': 'Bengaluru',
    'madras': 'Chennai',
    'bombay': 'Mumbai'
  };
  const trimmed = cityName ? cityName.trim() : '';
  const query = aliases[trimmed.toLowerCase()] || trimmed;

  const endpoint = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
  const response = await fetch(endpoint, { signal });

  if (!response.ok) {
    throw new Error(`Geocoding failed with status: ${response.status}`);
  }

  const data = await response.json();
  if (!data || !data.results || data.results.length === 0) {
    throw new Error(`City "${cityName}" not found. Please check spelling.`);
  }

  const loc = data.results[0];
  return {
    id: loc.id,
    name: loc.name,
    country: loc.country || '',
    countryCode: loc.country_code || '',
    admin1: loc.admin1 || '',
    latitude: loc.latitude,
    longitude: loc.longitude,
    timezone: loc.timezone || 'auto'
  };
}

/* --------------------------------------------------------------------------
   FUNCTION 4: fetchWeather(latitude, longitude, [timezone], [signal])
   -------------------------------------------------------------------------- */
/**
 * Retrieves comprehensive meteorological forecast dataset from Open-Meteo API.
 * @param {number} latitude
 * @param {number} longitude
 * @param {string} [timezone='auto']
 * @param {AbortSignal} [signal]
 * @returns {Promise<Object>} Weather forecast JSON response.
 */
async function fetchWeather(latitude, longitude, timezone = 'auto', signal = null) {
  if (typeof window !== 'undefined' && typeof window.fetchWeather === 'function' && window.fetchWeather !== fetchWeather) {
    return window.fetchWeather(latitude, longitude, timezone, signal);
  }

  const currentParams = 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m';
  const hourlyParams = 'temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,surface_pressure,visibility,wind_speed_10m,uv_index,is_day';
  const dailyParams = 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,wind_speed_10m_max';

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=${currentParams}&hourly=${hourlyParams}&daily=${dailyParams}&timezone=${encodeURIComponent(timezone)}`;

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Weather forecast API failed with status: ${response.status}`);
  }

  return response.json();
}

/* --------------------------------------------------------------------------
   FUNCTION 5: displayCurrentWeather(data, cityInfo)
   -------------------------------------------------------------------------- */
/**
 * Renders the primary current weather hero card.
 * @param {Object} data - Raw Open-Meteo weather response.
 * @param {Object} cityInfo - City location info.
 */
function displayCurrentWeather(data, cityInfo) {
  if (!data || !data.current) return;

  const current = data.current;
  const isDay = current.is_day !== undefined ? current.is_day : 1;
  const code = current.weather_code !== undefined ? current.weather_code : 0;

  // City & Country
  const cityNameEl = document.getElementById('current-city-name');
  const countryEl = document.getElementById('current-country');
  if (cityNameEl) cityNameEl.textContent = cityInfo.name;
  if (countryEl) countryEl.textContent = cityInfo.country || 'Global';

  // Observation Time & Date
  const timeEl = document.getElementById('observation-time');
  const dateEl = document.getElementById('observation-date');
  const obsDate = new Date(current.time);
  if (timeEl) {
    timeEl.textContent = obsDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  if (dateEl) {
    dateEl.textContent = obsDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  // Temperatures with Unit Conversion
  const tempValEl = document.getElementById('current-temp-val');
  const tempUnitEl = document.getElementById('current-temp-unit');
  const feelsValEl = document.getElementById('current-feels-like-val');
  const feelsUnitEl = document.getElementById('current-feels-unit');

  const convertedTemp = convertTemperature(current.temperature_2m, state.temperatureUnit);
  const convertedFeels = convertTemperature(current.apparent_temperature, state.temperatureUnit);

  if (tempValEl) tempValEl.textContent = convertedTemp !== null ? Math.round(convertedTemp) : '--';
  if (tempUnitEl) tempUnitEl.textContent = `°${state.temperatureUnit}`;
  if (feelsValEl) feelsValEl.textContent = convertedFeels !== null ? Math.round(convertedFeels) : '--';
  if (feelsUnitEl) feelsUnitEl.textContent = `°${state.temperatureUnit}`;

  // Weather Condition Text
  const conditionEl = document.getElementById('current-weather-desc');
  const conditionText = getWeatherDescription(code, isDay);
  if (conditionEl) conditionEl.textContent = conditionText;

  // Weather Icon
  const iconEl = document.getElementById('current-weather-icon');
  if (iconEl) {
    const iconClass = getWeatherIcon(code, isDay);
    iconEl.className = `fa-solid ${iconClass} main-weather-icon`;
    iconEl.setAttribute('aria-label', conditionText);
  }
}

/* --------------------------------------------------------------------------
   FUNCTION 6: displayWeatherDetails(data)
   -------------------------------------------------------------------------- */
/**
 * Renders the 7 detailed atmospheric metrics cards.
 * @param {Object} data - Raw Open-Meteo response.
 */
function displayWeatherDetails(data) {
  if (!data || !data.current) return;

  const current = data.current;
  const hourly = data.hourly || {};

  // 1. Relative Humidity
  const humidityEl = document.getElementById('detail-humidity');
  const humiditySub = document.getElementById('detail-humidity-sub');
  if (humidityEl) humidityEl.textContent = current.relative_humidity_2m !== undefined ? current.relative_humidity_2m : '--';
  if (humiditySub) {
    const h = current.relative_humidity_2m;
    humiditySub.textContent = h < 30 ? 'Dry air' : h > 70 ? 'High humidity' : 'Comfortable';
  }

  // 2. Wind Speed & Direction
  const windEl = document.getElementById('detail-wind-speed');
  const windDirEl = document.getElementById('detail-wind-dir');
  if (windEl) windEl.textContent = current.wind_speed_10m !== undefined ? Math.round(current.wind_speed_10m) : '--';
  if (windDirEl) {
    const compass = getWindDirectionCompass(current.wind_direction_10m);
    windDirEl.textContent = `Direction: ${compass} (${current.wind_direction_10m || 0}°)`;
  }

  // 3. Atmospheric Pressure
  const pressureEl = document.getElementById('detail-pressure');
  if (pressureEl) pressureEl.textContent = current.surface_pressure !== undefined ? Math.round(current.surface_pressure) : '--';

  // 4. Cloud Cover
  const cloudEl = document.getElementById('detail-cloud-cover');
  const cloudSub = document.getElementById('detail-cloud-sub');
  if (cloudEl) cloudEl.textContent = current.cloud_cover !== undefined ? current.cloud_cover : '--';
  if (cloudSub) {
    const c = current.cloud_cover;
    cloudSub.textContent = c < 20 ? 'Clear skies' : c < 60 ? 'Scattered clouds' : 'Heavy overcast';
  }

  // 5. Visibility (Extract from current hour in hourly data, convert m to km)
  const visibilityEl = document.getElementById('detail-visibility');
  if (visibilityEl) {
    let visKm = 'Not Available';
    if (hourly.visibility && hourly.visibility.length > 0) {
      const visMeters = hourly.visibility[0];
      visKm = (visMeters / 1000).toFixed(1);
    }
    visibilityEl.textContent = visKm;
  }

  // 6. UV Index (Extract from current hour in hourly data)
  const uvEl = document.getElementById('detail-uv-index');
  const uvBadge = document.getElementById('detail-uv-badge');
  if (uvEl) {
    let uvVal = '--';
    if (hourly.uv_index && hourly.uv_index.length > 0) {
      // Find current hour UV or fallback to first
      uvVal = Math.round(hourly.uv_index[0]);
    }
    uvEl.textContent = uvVal !== '--' ? uvVal : 'Not Available';
    if (uvBadge) {
      const risk = getUVIndexRisk(typeof uvVal === 'number' ? uvVal : null);
      uvBadge.textContent = risk.label;
      uvBadge.className = `uv-badge ${risk.colorClass}`;
    }
  }

  // 7. Precipitation
  const precipEl = document.getElementById('detail-precipitation');
  if (precipEl) {
    precipEl.textContent = current.precipitation !== undefined ? current.precipitation.toFixed(1) : '0.0';
  }
}

/* --------------------------------------------------------------------------
   FUNCTION 7: displayHourlyForecast(data)
   -------------------------------------------------------------------------- */
/**
 * Renders the horizontally scrollable 24-hour forecast cards.
 * @param {Object} data - Raw Open-Meteo response.
 */
function displayHourlyForecast(data) {
  const container = document.getElementById('hourly-forecast-list');
  if (!container || !data || !data.hourly) return;

  const hourly = data.hourly;
  container.innerHTML = '';

  // Determine starting index based on current time
  const currentTime = data.current ? data.current.time : new Date().toISOString();
  let startIndex = 0;
  if (hourly.time) {
    const foundIdx = hourly.time.findIndex(t => t >= currentTime.slice(0, 13));
    if (foundIdx !== -1) startIndex = foundIdx;
  }

  // Display next 24 hours
  const hoursToShow = 24;
  const endIndex = Math.min(startIndex + hoursToShow, (hourly.time || []).length);

  for (let i = startIndex; i < endIndex; i++) {
    const timeStr = hourly.time[i];
    const tempC = hourly.temperature_2m[i];
    const convertedTemp = convertTemperature(tempC, state.temperatureUnit);
    const code = hourly.weather_code[i];
    const isDay = hourly.is_day ? hourly.is_day[i] : 1;
    const precipProb = hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0;

    const hourLabel = formatHourTime(timeStr);
    const iconClass = getWeatherIcon(code, isDay);
    const condition = getWeatherDescription(code, isDay);

    const card = document.createElement('div');
    card.className = 'hourly-card';
    card.innerHTML = `
      <span class="hourly-time">${hourLabel}</span>
      <i class="fa-solid ${iconClass} hourly-icon" aria-hidden="true"></i>
      <span class="hourly-temp">${convertedTemp !== null ? Math.round(convertedTemp) : '--'}°${state.temperatureUnit}</span>
      <span class="hourly-desc">${condition}</span>
      <span class="hourly-precip" title="Precipitation Probability">
        <i class="fa-solid fa-droplet" aria-hidden="true"></i> ${precipProb}%
      </span>
    `;
    container.appendChild(card);
  }
}

/* --------------------------------------------------------------------------
   FUNCTION 8: displayDailyForecast(data)
   -------------------------------------------------------------------------- */
/**
 * Renders the 5-day weather forecast grid.
 * @param {Object} data - Raw Open-Meteo response.
 */
function displayDailyForecast(data) {
  const container = document.getElementById('daily-forecast-grid');
  if (!container || !data || !data.daily) return;

  const daily = data.daily;
  container.innerHTML = '';

  // Skip index 0 (today) if more than 5 days are returned, so we display 5 upcoming days
  const totalDays = (daily.time || []).length;
  const startIndex = totalDays > 5 ? 1 : 0;
  const daysCount = 5;

  for (let i = startIndex; i < startIndex + daysCount && i < totalDays; i++) {
    const dateStr = daily.time[i];
    const { dayName, shortDate } = formatForecastDate(dateStr);
    const code = daily.weather_code[i];
    const maxTemp = convertTemperature(daily.temperature_2m_max[i], state.temperatureUnit);
    const minTemp = convertTemperature(daily.temperature_2m_min[i], state.temperatureUnit);
    const precipProb = daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0;

    const iconClass = getWeatherIcon(code, 1);
    const condition = getWeatherDescription(code, 1);

    const card = document.createElement('div');
    card.className = 'daily-card';
    card.innerHTML = `
      <div class="daily-header">
        <span class="daily-day">${dayName}</span>
        <span class="daily-date">${shortDate}</span>
      </div>
      <div class="daily-icon-wrap" aria-hidden="true">
        <i class="fa-solid ${iconClass} daily-icon"></i>
      </div>
      <span class="daily-condition">${condition}</span>
      <div class="daily-temp-row">
        <span class="daily-temp-max" title="Maximum Temperature">${maxTemp !== null ? Math.round(maxTemp) : '--'}°</span>
        <span class="daily-temp-min" title="Minimum Temperature">${minTemp !== null ? Math.round(minTemp) : '--'}°</span>
      </div>
      <span class="daily-precip-badge">
        <i class="fa-solid fa-droplet" aria-hidden="true"></i> ${precipProb}%
      </span>
    `;
    container.appendChild(card);
  }
}

/* --------------------------------------------------------------------------
   FUNCTION 9: getWeatherDescription(code, [isDay=1])
   -------------------------------------------------------------------------- */
/**
 * Returns weather condition description for given WMO code.
 * @param {number} code
 * @param {number|boolean} [isDay=1]
 * @returns {string} Human-friendly condition text.
 */
function getWeatherDescription(code, isDay = 1) {
  if (typeof window !== 'undefined' && typeof window.WMO_CODE_MAP !== 'undefined') {
    const isDaytime = Boolean(isDay);
    const item = window.WMO_CODE_MAP[code];
    if (item) {
      return isDaytime ? item.descriptionDay : item.descriptionNight;
    }
  }
  return 'Clear Sky';
}

/* --------------------------------------------------------------------------
   FUNCTION 10: getWeatherIcon(code, [isDay=1])
   -------------------------------------------------------------------------- */
/**
 * Returns FontAwesome class name for given WMO code and time of day.
 * @param {number} code
 * @param {number|boolean} [isDay=1]
 * @returns {string} Icon class.
 */
function getWeatherIcon(code, isDay = 1) {
  if (typeof window !== 'undefined' && typeof window.WMO_CODE_MAP !== 'undefined') {
    const isDaytime = Boolean(isDay);
    const item = window.WMO_CODE_MAP[code];
    if (item) {
      return isDaytime ? item.iconDay : item.iconNight;
    }
  }
  return 'fa-cloud';
}

/* --------------------------------------------------------------------------
   FUNCTION 11: convertTemperature(celsius, unit)
   -------------------------------------------------------------------------- */
/**
 * Converts temperature from Celsius to Fahrenheit if unit === 'F'.
 * @param {number} celsius - Temperature in °C.
 * @param {string} unit - 'C' or 'F'.
 * @returns {number|null} Converted numeric value.
 */
function convertTemperature(celsius, unit = 'C') {
  if (celsius === null || celsius === undefined || isNaN(celsius)) {
    return null;
  }
  if (String(unit).toUpperCase() === 'F') {
    return Math.round(((celsius * 9) / 5 + 32) * 10) / 10;
  }
  return Math.round(celsius * 10) / 10;
}

/* --------------------------------------------------------------------------
   FUNCTION 12: saveFavoriteCity(cityInfo)
   -------------------------------------------------------------------------- */
/**
 * Adds or removes a city from favorites and persists in LocalStorage.
 * @param {Object} cityInfo - City location info.
 */
function saveFavoriteCity(cityInfo) {
  if (!cityInfo || !cityInfo.name) return;

  const existsIdx = state.favorites.findIndex(
    f => f.name.toLowerCase() === cityInfo.name.toLowerCase() && f.country === cityInfo.country
  );

  if (existsIdx > -1) {
    // Remove if already favorite (toggle behavior)
    state.favorites.splice(existsIdx, 1);
  } else {
    // Add to favorites
    state.favorites.unshift({
      name: cityInfo.name,
      country: cityInfo.country,
      latitude: cityInfo.latitude,
      longitude: cityInfo.longitude,
      timezone: cityInfo.timezone
    });
  }

  // Persist
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state.favorites));
  } catch (err) {
    console.error('Failed to save favorites to localStorage:', err);
  }

  updateFavoriteButtonState();
  renderFavoritesList();
}

/* --------------------------------------------------------------------------
   FUNCTION 13: loadFavoriteCities()
   -------------------------------------------------------------------------- */
/**
 * Retrieves persisted favorites from LocalStorage and updates the UI list.
 * @returns {Array<Object>} List of favorite cities.
 */
function loadFavoriteCities() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    state.favorites = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(state.favorites)) state.favorites = [];
  } catch (err) {
    console.warn('Error reading favorites from localStorage:', err);
    state.favorites = [];
  }

  renderFavoritesList();
  return state.favorites;
}

/* --------------------------------------------------------------------------
   FUNCTION 14: saveSearchHistory(cityName)
   -------------------------------------------------------------------------- */
/**
 * Saves a searched city name to recent search history in LocalStorage without duplicates.
 * @param {string} cityName - Name of searched city.
 */
function saveSearchHistory(cityName) {
  if (!cityName) return;
  const name = cityName.trim();

  // Remove duplicate if exists
  state.recentSearches = state.recentSearches.filter(
    item => item.toLowerCase() !== name.toLowerCase()
  );

  // Add to front
  state.recentSearches.unshift(name);

  // Cap at 6 recent searches
  if (state.recentSearches.length > 6) {
    state.recentSearches = state.recentSearches.slice(0, 6);
  }

  try {
    localStorage.setItem(STORAGE_KEYS.RECENTS, JSON.stringify(state.recentSearches));
  } catch (err) {
    console.warn('Error saving recent searches:', err);
  }

  renderRecentSearchesList();
}

/* --------------------------------------------------------------------------
   FUNCTION 15: handleAPIError(error, [context])
   -------------------------------------------------------------------------- */
/**
 * Converts caught API or network errors into user-friendly localized messages.
 * @param {Error} error - Caught error.
 * @param {string} [context=''] - Description of where error occurred.
 * @returns {string} User-facing error message.
 */
function handleAPIError(error, context = '') {
  console.error(`[WeatherNow Error] (${context}):`, error);

  if (error && error.userMessage) {
    return error.userMessage;
  }
  if (error && error.message) {
    if (error.message.includes('not found')) {
      return error.message;
    }
    if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
      return 'Unable to connect to the weather service. Please check your internet connection.';
    }
  }
  return 'Could not retrieve weather data at this moment. Please try again.';
}

/* --------------------------------------------------------------------------
   ADDITIONAL UI & CONTROLLER HELPERS
   -------------------------------------------------------------------------- */

/**
 * Loads recent searches from LocalStorage.
 */
function loadRecentSearches() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECENTS);
    state.recentSearches = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(state.recentSearches)) state.recentSearches = [];
  } catch (err) {
    state.recentSearches = [];
  }
  renderRecentSearchesList();
}

/**
 * Renders the favorite cities chips in the Quick Access panel.
 */
function renderFavoritesList() {
  const container = document.getElementById('favorites-list');
  const countBadge = document.getElementById('favorites-count');
  if (!container) return;

  if (countBadge) {
    countBadge.textContent = `${state.favorites.length} saved`;
  }

  if (state.favorites.length === 0) {
    container.innerHTML = '<p class="empty-state-text">No favorites saved yet. Click the heart icon on any city to bookmark it!</p>';
    return;
  }

  container.innerHTML = '';
  state.favorites.forEach((fav) => {
    const chip = document.createElement('div');
    chip.className = 'access-chip';
    chip.innerHTML = `
      <button type="button" class="chip-load-btn" aria-label="Load weather for ${fav.name}">
        <i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${fav.name}
      </button>
      <button type="button" class="chip-remove-btn" aria-label="Remove ${fav.name} from favorites" title="Remove">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    `;

    // Click on city name -> load city
    chip.querySelector('.chip-load-btn').addEventListener('click', () => {
      searchCity(fav.name);
    });

    // Click on x -> remove from favorites
    chip.querySelector('.chip-remove-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      saveFavoriteCity(fav);
    });

    container.appendChild(chip);
  });
}

/**
 * Renders recent searches chips.
 */
function renderRecentSearchesList() {
  const container = document.getElementById('recent-searches-list');
  if (!container) return;

  if (state.recentSearches.length === 0) {
    container.innerHTML = '<p class="empty-state-text">No recent searches yet.</p>';
    return;
  }

  container.innerHTML = '';
  state.recentSearches.forEach((city) => {
    const chip = document.createElement('div');
    chip.className = 'access-chip';
    chip.innerHTML = `
      <button type="button" class="chip-load-btn" aria-label="Search ${city}">
        <i class="fa-solid fa-clock-rotate-left" aria-hidden="true"></i> ${city}
      </button>
    `;
    chip.querySelector('.chip-load-btn').addEventListener('click', () => {
      searchCity(city);
    });
    container.appendChild(chip);
  });
}

/**
 * Updates heart icon depending on whether current city is in favorites.
 */
function updateFavoriteButtonState() {
  const btn = document.getElementById('btn-favorite-toggle');
  const icon = document.getElementById('favorite-heart-icon');
  if (!btn || !icon || !state.currentCity) return;

  const isFav = state.favorites.some(
    f => f.name.toLowerCase() === state.currentCity.name.toLowerCase()
  );

  if (isFav) {
    btn.classList.add('active');
    btn.setAttribute('aria-label', `Remove ${state.currentCity.name} from favorites`);
    icon.className = 'fa-solid fa-heart';
  } else {
    btn.classList.remove('active');
    btn.setAttribute('aria-label', `Add ${state.currentCity.name} to favorites`);
    icon.className = 'fa-regular fa-heart';
  }
}

/**
 * Sets temperature unit ('C' or 'F') and re-renders display without refetching.
 * @param {string} unit - 'C' or 'F'.
 * @param {boolean} [persist=true] - Whether to save to LocalStorage.
 */
function setTemperatureUnit(unit, persist = true) {
  state.temperatureUnit = unit.toUpperCase() === 'F' ? 'F' : 'C';

  if (persist) {
    localStorage.setItem(STORAGE_KEYS.UNIT, state.temperatureUnit);
  }

  // Update button visual states
  const btnC = document.getElementById('unit-c-btn');
  const btnF = document.getElementById('unit-f-btn');
  if (btnC && btnF) {
    if (state.temperatureUnit === 'C') {
      btnC.classList.add('active');
      btnC.setAttribute('aria-pressed', 'true');
      btnF.classList.remove('active');
      btnF.setAttribute('aria-pressed', 'false');
    } else {
      btnF.classList.add('active');
      btnF.setAttribute('aria-pressed', 'true');
      btnC.classList.remove('active');
      btnC.setAttribute('aria-pressed', 'false');
    }
  }

  // If weather data is already loaded, update all displayed temperature elements
  if (state.weatherData && state.currentCity) {
    displayCurrentWeather(state.weatherData, state.currentCity);
    displayHourlyForecast(state.weatherData);
    displayDailyForecast(state.weatherData);
  }
}

/**
 * Toggles or applies Dark/Light mode theme.
 * @param {string} theme - 'dark' or 'light'.
 */
function setAppTheme(theme) {
  state.theme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
}

/**
 * Displays error or informational alert banner.
 * @param {string} message
 * @param {string} [type='error']
 */
function showAlert(message, type = 'error') {
  const banner = document.getElementById('alert-banner');
  const msgEl = document.getElementById('alert-message');
  if (!banner || !msgEl) return;

  msgEl.textContent = message;
  banner.classList.remove('hidden');
}

/**
 * Hides the alert banner.
 */
function hideAlert() {
  const banner = document.getElementById('alert-banner');
  if (banner) banner.classList.add('hidden');
}

/**
 * Shows or hides the loading spinner.
 * @param {boolean} show
 * @param {string} [text='Loading weather data...']
 */
function showLoading(show, text = 'Loading weather data...') {
  const loading = document.getElementById('loading-state');
  const loadingText = document.getElementById('loading-text');
  const submitBtn = document.getElementById('search-submit-btn');

  if (loading) {
    if (show) {
      if (loadingText) loadingText.textContent = text;
      loading.classList.remove('hidden');
    } else {
      loading.classList.add('hidden');
    }
  }

  if (submitBtn) {
    submitBtn.disabled = show;
  }
}

/**
 * Shows or hides clear button inside search input.
 * @param {boolean} show
 */
function toggleSearchClearBtn(show) {
  const clearBtn = document.getElementById('search-clear-btn');
  if (clearBtn) {
    if (show) clearBtn.classList.remove('hidden');
    else clearBtn.classList.add('hidden');
  }
}

/**
 * Updates top date badge and footer copyright year.
 */
function updateDateBadges() {
  const dateEl = document.getElementById('header-date-text');
  const yearEl = document.getElementById('copyright-year');
  const now = new Date();

  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  if (yearEl) {
    yearEl.textContent = now.getFullYear();
  }
}

/**
 * Configures all application DOM event listeners.
 */
function setupEventListeners() {
  // Search Form Submission
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('city-search-input');
  const clearBtn = document.getElementById('search-clear-btn');

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (searchInput) searchCity(searchInput.value);
    });
  }

  // Input typing -> toggle clear button
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      toggleSearchClearBtn(searchInput.value.trim().length > 0);
    });
  }

  // Clear search input button
  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      toggleSearchClearBtn(false);
      searchInput.focus();
    });
  }

  // Popular City Pills
  const pillGroup = document.getElementById('quick-city-pills');
  if (pillGroup) {
    pillGroup.addEventListener('click', (e) => {
      const btn = e.target.closest('.city-pill');
      if (btn && btn.dataset.city) {
        searchCity(btn.dataset.city);
      }
    });
  }

  // Favorite City Toggle
  const favBtn = document.getElementById('btn-favorite-toggle');
  if (favBtn) {
    favBtn.addEventListener('click', () => {
      if (state.currentCity) {
        saveFavoriteCity(state.currentCity);
      }
    });
  }

  // Clear Recent Searches Button
  const clearRecentsBtn = document.getElementById('clear-history-btn');
  if (clearRecentsBtn) {
    clearRecentsBtn.addEventListener('click', () => {
      state.recentSearches = [];
      localStorage.removeItem(STORAGE_KEYS.RECENTS);
      renderRecentSearchesList();
    });
  }

  // Temperature Unit Toggles
  const btnC = document.getElementById('unit-c-btn');
  const btnF = document.getElementById('unit-f-btn');
  if (btnC) btnC.addEventListener('click', () => setTemperatureUnit('C'));
  if (btnF) btnF.addEventListener('click', () => setTemperatureUnit('F'));

  // Theme Toggle
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      setAppTheme(nextTheme);
    });
  }

  // Alert Dismiss Button
  const dismissBtn = document.getElementById('alert-dismiss-btn');
  if (dismissBtn) dismissBtn.addEventListener('click', hideAlert);

  // Mobile Navigation Drawer Toggle
  const navToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('primary-navigation');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile nav when clicking a nav link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

// Auto-run on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initializeApp);
}

// Export for Node.js test environment while remaining global in browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    state,
    initializeApp,
    searchCity,
    getCoordinates,
    fetchWeather,
    displayCurrentWeather,
    displayWeatherDetails,
    displayHourlyForecast,
    displayDailyForecast,
    getWeatherDescription,
    getWeatherIcon,
    convertTemperature,
    saveFavoriteCity,
    loadFavoriteCities,
    saveSearchHistory,
    handleAPIError
  };
}
