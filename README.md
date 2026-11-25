# WeatherNow – Live Weather Dashboard

> **"Explore the Weather. Understand Your World."**  
> A high-performance, responsive real-time meteorological dashboard powered by the Open-Meteo REST API, built with pure semantic HTML5, modern CSS3, and Vanilla JavaScript (ES6+).

---

## 1. Project Overview

**WeatherNow** is an end-to-end frontend web application developed as part of the **InternCircle Full Stack Web Development Internship**. It delivers real-time weather observations, 24-hour hourly trend projections, and 5-day meteorological forecasts across any searchable global city without requiring a paid or proprietary API key.

### Key Highlights
- **Zero Frontend Frameworks**: 100% pure HTML5, CSS3, and Vanilla JavaScript.
- **Real-Time REST API Integration**: Powered by the Open-Meteo Geocoding and Weather Forecast REST APIs.
- **Asynchronous Architecture**: Full async/await, Promise lifecycle handling, and `AbortController` request cancellation to eliminate race conditions.
- **Glassmorphic Dark & Light Theme**: Seamless switching between deep navy dark mode and clean light mode, with automatic LocalStorage persistence.
- **Dynamic Temperature Unit Switching**: Instant toggle between Celsius (°C) and Fahrenheit (°F) with in-memory conversion across current, hourly, and daily forecasts without redundant network calls.
- **Bookmark & Search History**: Add favorite cities with a single click and access recent searches stored in LocalStorage.
- **Accessibility & SEO**: Accessible markup (ARIA roles and labels, skip links, focus states, `prefers-reduced-motion`) and semantic structure.

---

## 2. Technologies Used

- **HTML5**: Semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`), ARIA attributes, structured metadata.
- **CSS3**: CSS Custom Properties (Variables), Flexbox, CSS Grid, Glassmorphism backdrop-filters, Keyframe animations, Responsive media queries (360px, 480px, 768px, 1024px, 1280px).
- **Vanilla JavaScript (ES6+)**: Fetch API, Async/Await, Promises, `AbortController`, LocalStorage API, DOM manipulation.
- **Icons & Typography**: Font Awesome 6.5.1 (SVG web font) and Google Fonts (*Plus Jakarta Sans* & *Inter*).
- **External Data Source**: Open-Meteo REST API (Geocoding & Forecast).

---

## 3. Meteorological APIs & Data Sources

| API Service | Endpoint URL | Purpose |
| :--- | :--- | :--- |
| **Geocoding API** | `https://geocoding-api.open-meteo.com/v1/search` | Translates user-entered city names into exact latitude, longitude, and country metadata. |
| **Weather Forecast API** | `https://api.open-meteo.com/v1/forecast` | Returns current weather, 24-hour hourly predictions, and 7-day daily forecasts. |

Official Documentation: [https://open-meteo.com/en/docs](https://open-meteo.com/en/docs)

---

## 4. Project Directory Structure

```
weathernow/
│
├── index.html              # Semantic HTML5 layout (Single-page dashboard)
├── css/
│   └── style.css           # Glassmorphism dark/light theme, Flexbox/Grid layouts & queries
├── js/
│   ├── weather-utils.js    # WMO code interpretations, unit conversions, date/time formatters
│   ├── api.js              # Geocoding & Weather fetchers with AbortController & error wrapping
│   └── script.js           # Main application controller, state management, DOM manipulation
├── assets/
│   └── icons/              # Weather icon assets and graphics
└── README.md               # Technical project documentation
```

---

## 5. Architectural Workflow

```
[ User Enters City Name ]
           │
           ▼
[ Input Sanitization & Validation ]
           │
           ▼
[ AbortController cancels pending request ]
           │
           ▼
[ Open-Meteo Geocoding REST API ] ──────► Returns { lat, lon, country, timezone }
           │
           ▼
[ Open-Meteo Weather Forecast API ] ───► Returns { current, hourly, daily }
           │
           ▼
[ Process WMO Weather Codes & Temperatures ]
           │
           ▼
[ Dynamic DOM Rendering ]
  ├── Current Weather Hero Card
  ├── 7 Atmospheric Metrics (Humidity, Wind, Pressure, Cloud, Visibility, UV, Precip)
  ├── 24-Hour Horizontally Scrollable Trend
  └── 5-Day Outlook Grid
```

---

## 6. Technical Implementation Deep Dive

### 6.1. Fetch API & Async/Await Architecture

All network communication uses the JavaScript Fetch API wrapped in `async/await` syntax with structured `try...catch` error blocks and HTTP response validation (`response.ok`):

```javascript
async function fetchWeather(latitude, longitude, timezone = 'auto', signal = null) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,visibility,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=${encodeURIComponent(timezone)}`;

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new WeatherAPIError(
      `Forecast API returned HTTP status ${response.status}`,
      'Weather service temporarily unavailable. Please try again.',
      response.status
    );
  }
  return response.json();
}
```

### 6.2. Race Condition Prevention via AbortController

Rapid typing or rapid clicking on city pills can cause older network requests to resolve after newer ones. WeatherNow cancels any in-flight request before initiating a new one:

```javascript
if (state.abortController) {
  state.abortController.abort(); // Cancel previous search
}
state.abortController = new AbortController();
const { signal } = state.abortController;

const location = await getCoordinates(city, signal);
const weather = await fetchWeather(location.latitude, location.longitude, location.timezone, signal);
```

### 6.3. WMO Weather Code Decoding

Open-Meteo supplies standard World Meteorological Organization (WMO) Weather Interpretation Codes (0 to 99). The application maps these to human descriptions and day/night sensitive icons:

```javascript
const WMO_CODE_MAP = {
  0: { descriptionDay: 'Clear Sky', iconDay: 'fa-sun', iconNight: 'fa-moon' },
  1: { descriptionDay: 'Mainly Clear', iconDay: 'fa-cloud-sun', iconNight: 'fa-cloud-moon' },
  2: { descriptionDay: 'Partly Cloudy', iconDay: 'fa-cloud-sun', iconNight: 'fa-cloud-moon' },
  3: { descriptionDay: 'Overcast', iconDay: 'fa-cloud', iconNight: 'fa-cloud' },
  61: { descriptionDay: 'Slight Rain', iconDay: 'fa-cloud-sun-rain', iconNight: 'fa-cloud-moon-rain' },
  63: { descriptionDay: 'Moderate Rain', iconDay: 'fa-cloud-rain', iconNight: 'fa-cloud-rain' },
  65: { descriptionDay: 'Heavy Rain', iconDay: 'fa-cloud-showers-heavy', iconNight: 'fa-cloud-showers-heavy' },
  71: { descriptionDay: 'Slight Snow Fall', iconDay: 'fa-snowflake', iconNight: 'fa-snowflake' },
  95: { descriptionDay: 'Thunderstorm', iconDay: 'fa-bolt', iconNight: 'fa-bolt' }
};
```

### 6.4. Dynamic Temperature Conversion

Switching between Celsius and Fahrenheit converts the loaded meteorological state in-memory:

$$F = C \times \frac{9}{5} + 32$$

No network request is dispatched when switching units, providing an instantaneous UI transition.

---

## 7. How to Run Locally

### Option 1: Direct Browser Launch
1. Clone or download the repository.
2. Navigate to the project directory:
   ```bash
   cd weathernow
   ```
3. Open `index.html` directly in any modern browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local HTTP Server (Recommended)
Using Python:
```bash
python -m http.server 3000
```
Using Node.js:
```bash
npx serve .
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 8. Automated Test Suite Results

The project was validated against **99 automated test assertions**:
- **Code Syntax**: Valid JavaScript across all scripts.
- **HTML Semantics**: Single `<h1>`, `<header>`, `<nav>`, `<main>`, `<footer>`, 12 complete sections, zero inline event handlers.
- **CSS Architecture**: Variables, Flexbox, Grid, 5 media queries, `prefers-reduced-motion`, `overflow-x: hidden`.
- **Functions**: All 15 required functions declared and verified.
- **Unit Conversions**: Celsius/Fahrenheit math, compass direction conversions, UV index tiers.
- **Live Open-Meteo API**: Verified live responses for Chennai, Bengaluru, Mumbai, and Thiruvannamalai.
- **Error Handling**: Graceful rejection of invalid/unknown cities.

**Test Summary**: `99 PASSED, 0 FAILED (100% Pass Rate)`

---

## 9. GitHub Deployment (GitHub Pages)

To host WeatherNow on GitHub Pages:
1. Push the code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete Project 04 - WeatherNow live weather dashboard"
   git branch -M main
   git remote add origin https://github.com/ELUMALAI2007/intern_circle.git
   git push -u origin main
   ```
2. Navigate to **Settings** > **Pages** in the repository.
3. Under **Branch**, select `main` (or designated branch) and root `/`.
4. Click **Save**. Your site will be live at `https://<username>.github.io/<repo>/`.

---

## 10. Author Information

- **Developer**: Elumalai M
- **Degree**: B.Tech in Artificial Intelligence and Data Science
- **College**: Rajalakshmi Institute of Technology, Chennai
- **University**: Anna University
- **GitHub**: [ELUMALAI2007](https://github.com/ELUMALAI2007)
- **Email**: vgpelumalai2007@gmail.com
- **Internship**: InternCircle Full Stack Web Development Internship
