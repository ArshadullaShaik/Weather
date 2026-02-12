// WeatherAPI.com API configuration
// Note: For a production app with sensitive data, use a backend proxy to secure the API key.
// For this simple weather app, client-side API key is acceptable as it's free tier with rate limits.
const API_KEY = 'YOUR_API_KEY_HERE'; // Users need to get their own API key from weatherapi.com
const API_BASE_URL = 'https://api.weatherapi.com/v1';

// Configuration constants
const ERROR_DISPLAY_DURATION = 5000; // Duration in ms to display error messages

// DOM elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherInfo = document.getElementById('weatherInfo');
const errorMsg = document.getElementById('errorMsg');
const loading = document.getElementById('loading');

// Weather data elements
const cityName = document.getElementById('cityName');
const localTime = document.getElementById('localTime');
const weatherIcon = document.getElementById('weatherIcon');
const temp = document.getElementById('temp');
const condition = document.getElementById('condition');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const uvIndex = document.getElementById('uvIndex');

// Event listeners
searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// Main search function
async function searchWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    // Check if API key is configured
    if (API_KEY === 'YOUR_API_KEY_HERE') {
        showError('Please configure your WeatherAPI.com API key in script.js');
        return;
    }

    hideElements();
    showLoading();

    try {
        const data = await fetchWeatherData(city);
        displayWeatherData(data);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// Fetch weather data from API
async function fetchWeatherData(city) {
    const url = `${API_BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        if (response.status === 400) {
            throw new Error('City not found. Please check the city name and try again.');
        } else if (response.status === 401) {
            throw new Error('Invalid API key. Please check your API key configuration.');
        } else if (response.status === 403) {
            throw new Error('API key limit exceeded or disabled.');
        } else {
            throw new Error('Failed to fetch weather data. Please try again later.');
        }
    }
    
    return await response.json();
}

// Display weather data
function displayWeatherData(data) {
    const { location, current } = data;
    
    // Update city and time
    cityName.textContent = `${location.name}, ${location.country}`;
    localTime.textContent = `Local time: ${formatTime(location.localtime)}`;
    
    // Update weather icon
    weatherIcon.src = `https:${current.condition.icon}`;
    weatherIcon.alt = current.condition.text;
    
    // Update temperature and condition
    temp.textContent = Math.round(current.temp_c);
    condition.textContent = current.condition.text;
    
    // Update weather details
    feelsLike.textContent = `${Math.round(current.feelslike_c)}°C`;
    humidity.textContent = `${current.humidity}%`;
    windSpeed.textContent = `${current.wind_kph} km/h`;
    pressure.textContent = `${current.pressure_mb} mb`;
    visibility.textContent = `${current.vis_km} km`;
    uvIndex.textContent = current.uv;
    
    // Show weather info
    weatherInfo.classList.remove('hidden');
}

// Format time from API response
function formatTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
}

// Show error message
function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
    setTimeout(() => {
        errorMsg.classList.add('hidden');
    }, ERROR_DISPLAY_DURATION);
}

// Hide all display elements
function hideElements() {
    weatherInfo.classList.add('hidden');
    errorMsg.classList.add('hidden');
}

// Show loading spinner
function showLoading() {
    loading.classList.remove('hidden');
}

// Hide loading spinner
function hideLoading() {
    loading.classList.add('hidden');
}
