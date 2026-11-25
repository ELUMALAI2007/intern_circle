/**
 * WeatherNow – Utility Functions & WMO Weather Code Mappings
 * Handles meteorological interpretations, unit conversions, and formatting.
 */

// WMO Weather Interpretation Codes (WW)
const WMO_CODE_MAP = {
  0: {
    descriptionDay: 'Clear Sky',
    descriptionNight: 'Clear Sky',
    iconDay: 'fa-sun',
    iconNight: 'fa-moon',
    theme: 'clear'
  },
  1: {
    descriptionDay: 'Mainly Clear',
    descriptionNight: 'Mainly Clear',
    iconDay: 'fa-cloud-sun',
    iconNight: 'fa-cloud-moon',
    theme: 'partly-cloudy'
  },
  2: {
    descriptionDay: 'Partly Cloudy',
    descriptionNight: 'Partly Cloudy',
    iconDay: 'fa-cloud-sun',
    iconNight: 'fa-cloud-moon',
    theme: 'partly-cloudy'
  },
  3: {
    descriptionDay: 'Overcast',
    descriptionNight: 'Overcast',
    iconDay: 'fa-cloud',
    iconNight: 'fa-cloud',
    theme: 'cloudy'
  },
  45: {
    descriptionDay: 'Foggy',
    descriptionNight: 'Foggy',
    iconDay: 'fa-smog',
    iconNight: 'fa-smog',
    theme: 'fog'
  },
  48: {
    descriptionDay: 'Depositing Rime Fog',
    descriptionNight: 'Depositing Rime Fog',
    iconDay: 'fa-smog',
    iconNight: 'fa-smog',
    theme: 'fog'
  },
  51: {
    descriptionDay: 'Light Drizzle',
    descriptionNight: 'Light Drizzle',
    iconDay: 'fa-cloud-rain',
    iconNight: 'fa-cloud-rain',
    theme: 'rain'
  },
  53: {
    descriptionDay: 'Moderate Drizzle',
    descriptionNight: 'Moderate Drizzle',
    iconDay: 'fa-cloud-rain',
    iconNight: 'fa-cloud-rain',
    theme: 'rain'
  },
  55: {
    descriptionDay: 'Dense Drizzle',
    descriptionNight: 'Dense Drizzle',
    iconDay: 'fa-cloud-showers-heavy',
    iconNight: 'fa-cloud-showers-heavy',
    theme: 'rain'
  },
  56: {
    descriptionDay: 'Light Freezing Drizzle',
    descriptionNight: 'Light Freezing Drizzle',
    iconDay: 'fa-snowflake',
    iconNight: 'fa-snowflake',
    theme: 'snow'
  },
  57: {
    descriptionDay: 'Dense Freezing Drizzle',
    descriptionNight: 'Dense Freezing Drizzle',
    iconDay: 'fa-snowflake',
    iconNight: 'fa-snowflake',
    theme: 'snow'
  },
  61: {
    descriptionDay: 'Slight Rain',
    descriptionNight: 'Slight Rain',
    iconDay: 'fa-cloud-sun-rain',
    iconNight: 'fa-cloud-moon-rain',
    theme: 'rain'
  },
  63: {
    descriptionDay: 'Moderate Rain',
    descriptionNight: 'Moderate Rain',
    iconDay: 'fa-cloud-rain',
    iconNight: 'fa-cloud-rain',
    theme: 'rain'
  },
  65: {
    descriptionDay: 'Heavy Rain',
    descriptionNight: 'Heavy Rain',
    iconDay: 'fa-cloud-showers-heavy',
    iconNight: 'fa-cloud-showers-heavy',
    theme: 'rain'
  },
  66: {
    descriptionDay: 'Light Freezing Rain',
    descriptionNight: 'Light Freezing Rain',
    iconDay: 'fa-snowflake',
    iconNight: 'fa-snowflake',
    theme: 'snow'
  },
  67: {
    descriptionDay: 'Heavy Freezing Rain',
    descriptionNight: 'Heavy Freezing Rain',
    iconDay: 'fa-snowflake',
    iconNight: 'fa-snowflake',
    theme: 'snow'
  },
  71: {
    descriptionDay: 'Slight Snow Fall',
    descriptionNight: 'Slight Snow Fall',
    iconDay: 'fa-snowflake',
    iconNight: 'fa-snowflake',
    theme: 'snow'
  },
  73: {
    descriptionDay: 'Moderate Snow Fall',
    descriptionNight: 'Moderate Snow Fall',
    iconDay: 'fa-snowflake',
    iconNight: 'fa-snowflake',
    theme: 'snow'
  },
  75: {
    descriptionDay: 'Heavy Snow Fall',
    descriptionNight: 'Heavy Snow Fall',
    iconDay: 'fa-snowflake',
    iconNight: 'fa-snowflake',
    theme: 'snow'
  },
  77: {
    descriptionDay: 'Snow Grains',
    descriptionNight: 'Snow Grains',
    iconDay: 'fa-snowflake',
    iconNight: 'fa-snowflake',
    theme: 'snow'
  },
  80: {
    descriptionDay: 'Slight Rain Showers',
    descriptionNight: 'Slight Rain Showers',
    iconDay: 'fa-cloud-sun-rain',
    iconNight: 'fa-cloud-moon-rain',
    theme: 'rain'
  },
  81: {
    descriptionDay: 'Moderate Rain Showers',
    descriptionNight: 'Moderate Rain Showers',
    iconDay: 'fa-cloud-rain',
    iconNight: 'fa-cloud-rain',
    theme: 'rain'
  },
  82: {
    descriptionDay: 'Violent Rain Showers',
    descriptionNight: 'Violent Rain Showers',
    iconDay: 'fa-cloud-showers-heavy',
    iconNight: 'fa-cloud-showers-heavy',
    theme: 'rain'
  },
  85: {
    descriptionDay: 'Slight Snow Showers',
    descriptionNight: 'Slight Snow Showers',
    iconDay: 'fa-snowflake',
    iconNight: 'fa-snowflake',
    theme: 'snow'
  },
  86: {
    descriptionDay: 'Heavy Snow Showers',
    descriptionNight: 'Heavy Snow Showers',
    iconDay: 'fa-snowflake',
    iconNight: 'fa-snowflake',
    theme: 'snow'
  },
  95: {
    descriptionDay: 'Thunderstorm',
    descriptionNight: 'Thunderstorm',
    iconDay: 'fa-bolt',
    iconNight: 'fa-bolt',
    theme: 'thunder'
  },
  96: {
    descriptionDay: 'Thunderstorm with Slight Hail',
    descriptionNight: 'Thunderstorm with Slight Hail',
    iconDay: 'fa-cloud-bolt',
    iconNight: 'fa-cloud-bolt',
    theme: 'thunder'
  },
  99: {
    descriptionDay: 'Thunderstorm with Heavy Hail',
    descriptionNight: 'Thunderstorm with Heavy Hail',
    iconDay: 'fa-cloud-bolt',
    iconNight: 'fa-cloud-bolt',
    theme: 'thunder'
  }
};

/**
 * Returns human-readable weather condition text.
 * @param {number} code - WMO weather code (0-99).
 * @param {number|boolean} isDay - 1 for daytime, 0 for nighttime.
 * @returns {string} Condition description.
 */
function getWeatherDescription(code, isDay = 1) {
  const isDaytime = Boolean(isDay);
  if (WMO_CODE_MAP[code]) {
    return isDaytime ? WMO_CODE_MAP[code].descriptionDay : WMO_CODE_MAP[code].descriptionNight;
  }
  return 'Unknown Weather';
}

/**
 * Returns FontAwesome icon class corresponding to the weather condition.
 * @param {number} code - WMO weather code (0-99).
 * @param {number|boolean} isDay - 1 for daytime, 0 for nighttime.
 * @returns {string} FontAwesome icon class name.
 */
function getWeatherIcon(code, isDay = 1) {
  const isDaytime = Boolean(isDay);
  if (WMO_CODE_MAP[code]) {
    return isDaytime ? WMO_CODE_MAP[code].iconDay : WMO_CODE_MAP[code].iconNight;
  }
  return 'fa-cloud';
}

/**
 * Converts temperature value between Celsius and Fahrenheit.
 * @param {number} celsius - Temperature in Celsius.
 * @param {string} unit - 'C' or 'F'.
 * @returns {number} Formatted temperature rounded to 1 decimal place.
 */
function convertTemperature(celsius, unit = 'C') {
  if (celsius === null || celsius === undefined || isNaN(celsius)) {
    return null;
  }
  if (unit.toUpperCase() === 'F') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return Math.round(fahrenheit * 10) / 10;
  }
  return Math.round(celsius * 10) / 10;
}

/**
 * Converts wind direction in degrees to a 16-point compass heading.
 * @param {number} degrees - Degrees (0-360).
 * @returns {string} Compass direction (e.g., 'N', 'NE', 'SSW').
 */
function getWindDirectionCompass(degrees) {
  if (degrees === null || degrees === undefined || isNaN(degrees)) return 'N/A';
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW'
  ];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

/**
 * Evaluates UV Index risk level description and color code.
 * @param {number} uv - UV Index.
 * @returns {{ label: string, colorClass: string }}
 */
function getUVIndexRisk(uv) {
  if (uv === null || uv === undefined || isNaN(uv)) {
    return { label: 'Not Available', colorClass: 'uv-na' };
  }
  if (uv <= 2) return { label: 'Low', colorClass: 'uv-low' };
  if (uv <= 5) return { label: 'Moderate', colorClass: 'uv-moderate' };
  if (uv <= 7) return { label: 'High', colorClass: 'uv-high' };
  if (uv <= 10) return { label: 'Very High', colorClass: 'uv-very-high' };
  return { label: 'Extreme', colorClass: 'uv-extreme' };
}

/**
 * Formats ISO date string into readable day and date.
 * @param {string} isoString - Date string (e.g. "2026-11-25").
 * @returns {{ dayName: string, shortDate: string, fullDate: string }}
 */
function formatForecastDate(isoString) {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return { dayName: 'Day', shortDate: '', fullDate: '' };
  }
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  const dayFull = date.toLocaleDateString('en-US', { weekday: 'long' });
  const shortDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const fullDate = `${dayFull}, ${shortDate}`;
  return { dayName, shortDate, fullDate };
}

/**
 * Formats hourly ISO timestamp to readable 12-hour time format.
 * @param {string} isoString - Timestamp string (e.g. "2026-11-25T14:00").
 * @returns {string} e.g. "2 PM" or "11 AM"
 */
function formatHourTime(isoString) {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '--';
  return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
}

// Export for Node.js test environment while remaining global in browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    WMO_CODE_MAP,
    getWeatherDescription,
    getWeatherIcon,
    convertTemperature,
    getWindDirectionCompass,
    getUVIndexRisk,
    formatForecastDate,
    formatHourTime
  };
}
