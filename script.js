const API_KEY = 'c10ff268552fb35cdec0ec84cd747a2c';
const WEATHER_ENDPOINT = 'https://api.openweathermap.org/data/2.5/weather';

const elements = {
    city: {
        input: document.getElementById('city-input'),
        display: document.getElementById('city'),
        suggestions: document.getElementById('suggestions-list')
    },
    weather: {
        temp: document.getElementById('temperature'),
        desc: document.getElementById('description'),
        humidity: document.getElementById('humidity'),
        wind: document.getElementById('wind-speed')
    },
    container: document.querySelector('.container'),
    weatherBox: document.querySelector('.weather-box'),
    weatherDetails: document.querySelector('.weather-details'),
    searchBtn: document.getElementById('search-btn')
};

const BRAZILIAN_CITIES = [
    "São Paulo, SP", "Rio de Janeiro, RJ", "Brasília, DF", "Salvador, BA",
    "Fortaleza, CE", "Belo Horizonte, MG", "Manaus, AM", "Curitiba, PR",
    "Recife, PE", "Porto Alegre, RS", "Belém, PA", "Goiânia, GO",
    "Guarulhos, SP", "Campinas, SP", "São Luís, MA", "São Gonçalo, RJ"
];

const WEATHER_ICONS = {
    '01d': 'wi wi-day-sunny',
    '02d': 'wi wi-day-cloudy',
    '03d': 'wi wi-cloud',
    '04d': 'wi wi-cloudy',
    '09d': 'wi wi-showers',
    '10d': 'wi wi-rain',
    '11d': 'wi wi-thunderstorm',
    '13d': 'wi wi-snow',
    '50d': 'wi wi-fog',
    '01n': 'wi wi-night-clear',
    '02n': 'wi wi-night-alt-cloudy',
    '03n': 'wi wi-cloud',
    '04n': 'wi wi-cloudy',
    '09n': 'wi wi-showers',
    '10n': 'wi wi-rain',
    '11n': 'wi wi-thunderstorm',
    '13n': 'wi wi-snow',
    '50n': 'wi wi-fog'
};

const filterCities = searchText => 
    !searchText ? [] : BRAZILIAN_CITIES.filter(city => 
        city.toLowerCase().includes(searchText.toLowerCase())
    );

const showSuggestions = suggestions => {
    elements.city.suggestions.innerHTML = '';
    
    if (!suggestions.length) {
        elements.city.suggestions.classList.remove('active');
        return;
    }

    suggestions.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        li.addEventListener('click', () => {
            elements.city.input.value = city;
            elements.city.suggestions.innerHTML = '';
            elements.city.suggestions.classList.remove('active');
            getWeatherData(city.split(',')[0]);
        });
        elements.city.suggestions.appendChild(li);
    });
    elements.city.suggestions.classList.add('active');
};

const toggleLoading = isLoading => {
    const action = isLoading ? 'add' : 'remove';
    [elements.container, elements.weatherBox, elements.weatherDetails]
        .forEach(el => el.classList[action]('loading'));
};

const updateWeatherUI = data => {
    elements.city.display.textContent = data.name;
    elements.weather.temp.textContent = `${parseInt(data.main.temp)}°C`;
    elements.weather.desc.textContent = data.weather[0].description;
    elements.weather.humidity.textContent = `${data.main.humidity}%`;
    elements.weather.wind.textContent = `${parseInt(data.wind.speed * 3.6)} km/h`;

    const weatherIconClass = WEATHER_ICONS[data.weather[0].icon] || 'wi wi-day-sunny';
    document.querySelector('.weather-icon i').className = weatherIconClass;
};

async function getWeatherData(city) {
    try {
        toggleLoading(true);
        const params = new URLSearchParams({
            q: city,
            units: 'metric',
            appid: API_KEY,
            lang: 'pt_br'
        });

        const response = await fetch(`${WEATHER_ENDPOINT}?${params}`);
        if (!response.ok) throw new Error('Cidade não encontrada');

        const data = await response.json();
        setTimeout(() => {
            updateWeatherUI(data);
            toggleLoading(false);
        }, 500);
    } catch (error) {
        alert('Erro ao buscar dados do clima. Por favor, verifique o nome da cidade.');
        toggleLoading(false);
    }
}

const handleSearch = () => {
    const city = elements.city.input.value.split(',')[0];
    if (city) getWeatherData(city);
};

elements.city.input.addEventListener('input', e => {
    showSuggestions(filterCities(e.target.value));
});

document.addEventListener('click', e => {
    if (!elements.city.input.contains(e.target) && !elements.city.suggestions.contains(e.target)) {
        elements.city.suggestions.classList.remove('active');
    }
});

elements.searchBtn.addEventListener('click', handleSearch);
elements.city.input.addEventListener('keyup', e => {
    if (e.key === 'Enter') handleSearch();
});
