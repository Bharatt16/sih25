let tempHumid = document.querySelector('#div-1');
let rainWind = document.querySelector('#div-2');
let locationHindi = document.querySelector('.location-info > div > div:first-child');
let locationEnglish = document.querySelector('.location-info > div > div:last-child');

let baseURL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';
const input = document.querySelector('.searchWrapper>input');
const submitBtn = document.querySelector('.searchWrapper>svg');

// Weather API fetch and display
submitBtn.addEventListener('click', async () => {
    let location = input.value.trim();
    if (!location) {
        alert('Please enter a location');
        return;
    }

    try {
        const response = await fetch(
            `${baseURL}/${encodeURIComponent(location)}?unitGroup=metric&key=MT84LCFDNK2XS7NYCV64E8J6V&contentType=json`
        );

        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        // Update location (English from API, Hindi as input for now)
        locationHindi.textContent = location; // user input (can map to Hindi if you want)
        locationEnglish.textContent = data.resolvedAddress; // API address

        // Today's weather
        let today = data.days[0];
        let temp = today.temp;
        let humidity = today.humidity;
        let wind = today.windspeed;

        // Update top summary
        tempHumid.textContent = `🌤 ${temp}°C | Humid: ${humidity}%`;
        rainWind.textContent = `Rain: ${today.precipprob}% | Wind: ${wind} km/h`;

        // Weather icon
        let iconName = today.icon;
        let img = document.createElement('img');
        img.src = `utilities/${iconName}.png`;
        img.alt = 'Weather Icon';

        let iconContainer = document.querySelector('.tempIcon');
        if (iconContainer) {
            iconContainer.innerHTML = "";
            iconContainer.appendChild(img);
        }

        // Update 3-day forecast
        let forecastEls = document.querySelectorAll('.forecast-day');
        forecastEls.forEach((el, i) => {
            if (i + 1 < data.days.length) {
                let day = data.days[i + 1];
                el.querySelector('div:nth-child(1)').textContent = new Date(day.datetime).toLocaleDateString('hi-IN', { weekday: 'short' });
                el.querySelector('div:nth-child(2)').textContent = getWeatherEmoji(day.icon);
                el.querySelector('div:nth-child(3)').textContent = `${day.tempmax}°/${day.tempmin}°`;
            }
        });

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch weather data. Please check the location and try again.');
    }
});

// Helper: map API icons → emoji
function getWeatherEmoji(icon) {
    const map = {
        "clear-day": "☀️",
        "clear-night": "🌙",
        "partly-cloudy-day": "⛅",
        "partly-cloudy-night": "☁️",
        "cloudy": "☁️",
        "rain": "🌧️",
        "snow": "❄️",
        "wind": "💨",
        "fog": "🌫️"
    };
    return map[icon] || "🌤️";
}
