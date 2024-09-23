const searchBox = document.querySelector('.search-box');
const searchBtn = document.querySelector('.btn-search');
const apiKey = '9d07f9e78b6f9c732bcc49d154d8f5d7';
const inputElement = document.querySelector('.search-box');

let displayName = document.querySelector('.cityName');
let displayCurrentTemp = document.querySelector('.currentTemp');

// Function to fetch weather for a city
const fetchWeatherDATA = async (cityName) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;
    try {
        const fetchData = await fetch(apiUrl);
        const response = await fetchData.json();

        if (fetchData.ok) {
            console.log(response); // Successfully fetched weather data, log to the console
            
            // Display city name and temperature
            displayName.innerHTML = cityName;
            displayCurrentTemp.innerHTML = `${response.list[0].main.temp} &deg;C`;

            // Select the <img> inside the .currentIcon div
            let displayCurrentIcon = document.querySelector('.currentIcon img');

            // Set the src attribute to the weather icon URL
            displayCurrentIcon.src = `https://openweathermap.org/img/wn/${response.list[0].weather[0].icon}@2x.png`;

            // Optionally, set the alt attribute for better accessibility
            displayCurrentIcon.alt = "Current weather icon";

            // Save the city name to local storage
            localStorage.setItem('selectedCity', cityName);

            // Update current weather display
            const displayWeather = document.querySelector('.display-weather-content');
            displayWeather.style.display = "block"; // Make sure the weather content is displayed when data is fetched

            // Get current weather
            let feelsLike = response.list[0].main.feels_like; // Real feel temperature
            let rainChance = response.list[0].pop * 100; // Probability of precipitation
            let windSpeed = response.list[0].wind.speed; // Wind speed

            // Update additional data
            document.querySelector('.feel-like').innerHTML = `${Math.round(feelsLike)} &deg;C`; // Real feel temperature
            document.querySelector('.rain').innerHTML = `${Math.round(rainChance)} %`; // Chances of rain
            document.querySelector('.wind').innerHTML = `${windSpeed} km/h`; // Wind speed

            // Get forecast for the rest of the day
            let forecastHTML = '';
            for (let i = 1; i < 20; i++) {
                let time = response.list[i].dt_txt;
                let forecastIcon = response.list[i].weather[0].icon;
                let forecastTemp = response.list[i].main.temp;
                let forecastDescription = response.list[i].weather[0].description;

                forecastHTML += `
                    <div class="forecastDetails">
                        <p>${time.split(' ')[1]}</p>
                        <div class="icons">
                            <img src="https://openweathermap.org/img/wn/${forecastIcon}@2x.png" alt="Icon">
                        </div>
                        <p>${forecastTemp} &deg;C</p>
                        <p>${forecastDescription}</p>
                    </div><hr>
                `;
            }
            document.querySelector('.forecastList').innerHTML = forecastHTML;

        } else {
            alert("City not found, please enter a valid city name.");
        }
    } catch (error) {
        console.error(error); // Handle network or other errors
        alert("An error occurred while fetching the weather data.");
    }
};

// Event listener for the search button
searchBtn.addEventListener("click", () => {
    const cityName = inputElement.value.trim(); // Get the value from the input box
    if (!cityName) {
        alert("Please enter a city name."); // Alert if the input is empty
        return;
    }

    fetchWeatherDATA(cityName); // Fetch weather for the entered city
});

// Check local storage for a saved city on page load
window.onload = () => {
    let savedCity = localStorage.getItem('selectedCity');
    const defaultCity = 'New York'; // Set your default city here

    // If no city is saved, use the default city
    if (!savedCity) {
        savedCity = defaultCity;
    }

    inputElement.value = savedCity; // Show saved or default city in the input box
    fetchWeatherDATA(savedCity); // Fetch weather for the saved or default city
};
