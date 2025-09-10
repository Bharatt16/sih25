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




// ===== TAB SWITCHING =====
function switchTab(tabId) {
    document.querySelectorAll(".tab-content").forEach(tab => {
      tab.classList.remove("active");
    });
    document.querySelectorAll(".nav-tab").forEach(btn => {
      btn.classList.remove("active");
    });
  
    document.getElementById(tabId).classList.add("active");
    event.currentTarget.classList.add("active");
  }
  
  // ===== LANGUAGE TOGGLE (Hindi <-> English) =====
  let isHindi = true;
  function toggleLanguage() {
    isHindi = !isHindi;
    const btn = document.querySelector(".language-btn");
    btn.innerText = isHindi ? "हिंदी 🔄" : "English 🔄";
  
    // Example text translation (extend this as needed)
    document.querySelector(".app-title").innerText = isHindi ? "🌾 SmartKrishi" : "🌾 SmartKrishi";
    document.querySelector("#home .card-title").innerText = isHindi ? "⚠ मिट्टी में नमी कम है" : "⚠ Low Soil Moisture";
  }
  
  // ===== OFFLINE BANNER HANDLING =====
  window.addEventListener("offline", () => {
    document.getElementById("offlineBanner").style.display = "block";
  });
  window.addEventListener("online", () => {
    document.getElementById("offlineBanner").style.display = "none";
  });
  
  // ===== CHAT OVERLAY TOGGLE =====
  function toggleChat() {
    const overlay = document.querySelector(".chat-overlay");
    const panel = document.querySelector(".chat-panel");
  
    const isVisible = overlay.style.display === "block";
    overlay.style.display = isVisible ? "none" : "block";
    panel.style.display = isVisible ? "none" : "block";
  }
  
  // Close chat when overlay clicked
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".chat-overlay").addEventListener("click", toggleChat);
  });
  
  // ===== CHATBOT (Simple Demo) =====
  function sendMessage() {
    const input = document.querySelector(".chat-input");
    const messages = document.querySelector(".chat-messages");
  
    if (!input.value.trim()) return;
  
    // User message
    const userMsg = document.createElement("div");
    userMsg.className = "message user";
    userMsg.innerHTML = `<div class="message-bubble">${input.value}</div>`;
    messages.appendChild(userMsg);
  
    // Scroll
    messages.scrollTop = messages.scrollHeight;
  
    // AI reply (dummy)
    setTimeout(() => {
      const aiMsg = document.createElement("div");
      aiMsg.className = "message ai";
      aiMsg.innerHTML = `<div class="message-bubble">🤖 Suggestion: Try growing अरहर this season for better soil nitrogen!</div>`;
      messages.appendChild(aiMsg);
      messages.scrollTop = messages.scrollHeight;
    }, 800);
  
    input.value = "";
  }
  
  // ===== CAMERA UPLOAD =====
  function openCamera() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment"; // opens back camera on mobile
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        alert("📸 Image captured: " + file.name + "\n(You can now send this for crop disease analysis!)");
      }
    };
    input.click();
  }

  let currentLang = "hi"; // default language

const translations = {
  en: {
    offline_banner: "📡 Offline Mode - Using cached data",
    app_title: "🌾 SmartKrishi",
    home: "Home",
    crops: "Crops",
    analysis: "Analysis",
    market: "Market",
    location: "Ranchi, Jharkhand",
    weather_summary1: "🌤 26°C | Humid: 78%",
    weather_summary2: "Rain: 40% | Wind: 12 km/h",
    alert_title: "⚠ Low soil moisture",
    alert_desc: "Field-A needs irrigation. Water within next 24 hours.",
    forecast: "🌦 Weather Forecast",
    soil_health: "🌱 Soil Health",
    soil_score: "Health Score",
    ask_question: "Ask your question...",
    assistant: "👨‍🌾 Farmer Assistant",
    detailed_plan: "Get Detailed Crop Plan 📋",
    download_report: "📄 Download Full Report"
  },
  hi: {
    offline_banner: "📡 ऑफलाइन मोड - कैश डेटा उपयोग हो रहा है",
    app_title: "🌾 स्मार्टकृषि",
    home: "होम",
    crops: "फसल",
    analysis: "विश्लेषण",
    market: "बाजार",
    location: "रांची, झारखंड",
    weather_summary1: "🌤 26°C | आर्द्रता: 78%",
    weather_summary2: "बारिश: 40% | हवा: 12 किमी/घं",
    alert_title: "⚠ मिट्टी में नमी कम है",
    alert_desc: "खेत-A में सिंचाई की जरूरत है। अगले 24 घंटों में पानी दें।",
    forecast: "🌦 मौसम पूर्वानुमान",
    soil_health: "🌱 मिट्टी का स्वास्थ्य",
    soil_score: "स्वास्थ्य स्कोर",
    ask_question: "अपना सवाल पूछें...",
    assistant: "👨‍🌾 किसान सहायक",
    detailed_plan: "विस्तृत खेती योजना पाएं 📋",
    download_report: "📄 पूरी रिपोर्ट डाउनलोड करें"
  }
};

function updateLanguage() {
  // Update all elements with data-i18n
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[currentLang][key]) {
      el.innerText = translations[currentLang][key];
    }
  });

  // Update placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (translations[currentLang][key]) {
      el.setAttribute("placeholder", translations[currentLang][key]);
    }
  });

  // Update language button text
  const btn = document.querySelector(".language-btn");
  if (btn) {
    btn.innerText = currentLang === "en" ? "English 🔄" : "हिंदी 🔄";
  }
}

function toggleLanguage() {
  currentLang = currentLang === "en" ? "hi" : "en";
  updateLanguage();
}

// Run on page load
document.addEventListener("DOMContentLoaded", updateLanguage);
