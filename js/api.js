/**
 * WeatherNow – API Integration Module
 * Integrates Open-Meteo Geocoding & Weather Forecast APIs with async/await and Fetch.
 */

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

// Global AbortController to cancel older in-flight search requests
let activeSearchAbortController = null;

/**
 * Custom error class for API-related exceptions with user-friendly descriptions.
 */
class WeatherAPIError extends Error {
  constructor(message, userMessage, statusCode = null) {
    super(message);
    this.name = 'WeatherAPIError';
    this.userMessage = userMessage;
    this.statusCode = statusCode;
  }
}

// Common city name aliases for enhanced geocoding hit rate
const CITY_ALIASES = {
  'thiruvannamalai': 'Tiruvannamalai',
  'bangalore': 'Bengaluru',
  'madras': 'Chennai',
  'bombay': 'Mumbai',
  'calcutta': 'Kolkata',
  'trivandrum': 'Thiruvananthapuram',
  'cochin': 'Kochi'
};

/**
 * Fetches geographical coordinates (latitude, longitude, country) for a given city.
 * @param {string} cityName - Name of the city to search.
 * @param {AbortSignal} [signal] - Optional AbortSignal to cancel request.
 * @returns {Promise<Object>} Top matched location object.
 */
async function getCoordinates(cityName, signal = null) {
  const sanitizedCity = cityName ? cityName.trim() : '';
  if (!sanitizedCity) {
    throw new WeatherAPIError(
      'City name is empty.',
      'Please enter a city name to explore the weather.'
    );
  }

  // Check alias dictionary for known variant spellings
  const queryCity = CITY_ALIASES[sanitizedCity.toLowerCase()] || sanitizedCity;
  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(queryCity)}&count=5&language=en&format=json`;

  let response;
  try {
    response = await fetch(url, { signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err; // Let caller ignore cancelled searches
    }
    throw new WeatherAPIError(
      `Network failure during geocoding: ${err.message}`,
      'Unable to connect to the weather service. Please check your internet connection.'
    );
  }

  if (!response.ok) {
    throw new WeatherAPIError(
      `Geocoding API responded with HTTP status ${response.status}`,
      'The geocoding service is currently unavailable. Please try again later.',
      response.status
    );
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new WeatherAPIError(
      `Failed to parse geocoding response: ${err.message}`,
      'Received an invalid response from the location server.'
    );
  }

  if (!data || !data.results || data.results.length === 0) {
    throw new WeatherAPIError(
      `No coordinates found for "${sanitizedCity}"`,
      `City "${sanitizedCity}" not found. Please verify the spelling and try again.`
    );
  }

  // Pick best match
  const location = data.results[0];
  return {
    id: location.id,
    name: location.name,
    country: location.country || '',
    countryCode: location.country_code || '',
    admin1: location.admin1 || '',
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone || 'auto',
    elevation: location.elevation || 0
  };
}

/**
 * Fetches comprehensive current, hourly and daily forecast data from Open-Meteo.
 * @param {number} latitude - Latitude coordinate.
 * @param {number} longitude - Longitude coordinate.
 * @param {string} [timezone='auto'] - Timezone identifier.
 * @param {AbortSignal} [signal] - Optional AbortSignal.
 * @returns {Promise<Object>} Complete weather dataset.
 */
async function fetchWeather(latitude, longitude, timezone = 'auto', signal = null) {
  if (latitude === undefined || latitude === null || longitude === undefined || longitude === null) {
    throw new WeatherAPIError(
      'Missing required latitude or longitude.',
      'Location coordinates could not be determined.'
    );
  }

  const currentParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'is_day',
    'precipitation',
    'rain',
    'showers',
    'snowfall',
    'weather_code',
    'cloud_cover',
    'surface_pressure',
    'wind_speed_10m',
    'wind_direction_10m'
  ].join(',');

  const hourlyParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'precipitation_probability',
    'weather_code',
    'surface_pressure',
    'visibility',
    'wind_speed_10m',
    'uv_index',
    'is_day'
  ].join(',');

  const dailyParams = [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'precipitation_probability_max',
    'uv_index_max',
    'wind_speed_10m_max'
  ].join(',');

  const url = `${WEATHER_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=${currentParams}&hourly=${hourlyParams}&daily=${dailyParams}&timezone=${encodeURIComponent(timezone)}`;

  let response;
  try {
    response = await fetch(url, { signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err;
    }
    throw new WeatherAPIError(
      `Network failure during weather fetch: ${err.message}`,
      'Unable to connect to the weather forecast service. Please try again.'
    );
  }

  if (!response.ok) {
    throw new WeatherAPIError(
      `Forecast API returned HTTP status ${response.status}`,
      'The weather forecast service encountered an error. Please try again later.',
      response.status
    );
  }

  let weatherData;
  try {
    weatherData = await response.json();
  } catch (err) {
    throw new WeatherAPIError(
      `Failed to parse weather JSON: ${err.message}`,
      'Unable to read forecast data from server.'
    );
  }

  if (!weatherData.current || !weatherData.daily) {
    throw new WeatherAPIError(
      'Incomplete weather response structure.',
      'Weather information for this location is incomplete.'
    );
  }

  return weatherData;
}

/**
 * Handles API and network errors, extracting user-friendly messages for UI display.
 * @param {Error} error - Error caught in try/catch.
 * @param {string} [context=''] - Description of context where error occurred.
 * @returns {string} Safe user-facing error message.
 */
function handleAPIError(error, context = '') {
  console.error(`[WeatherNow API Error] Context: ${context}`, error);

  if (error instanceof WeatherAPIError) {
    return error.userMessage;
  }
  if (error && error.name === 'AbortError') {
    return ''; // Aborted requests produce no visible error
  }
  return 'An unexpected error occurred while retrieving weather data. Please try again.';
}

// Export for Node.js test environment while remaining global in browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    WeatherAPIError,
    getCoordinates,
    fetchWeather,
    handleAPIError,
    activeSearchAbortController
  };
}
