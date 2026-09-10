import {geocodeCity, getForecast} from '../api/weather.api.js';

async function getWeatherForCity(city, days){
    const location = await geocodeCity(city);

    const forecast = await getForecast(location.latitude, location.longitude, days);

    return {
        location,
        forecast,
    };
}

async function getWeatherForCities(cities, days){
    const requests = cities.map((city) => {
        return getWeatherForCity(city, days);
    });

    return Promise.allSettled(requests);
}

export {
    getWeatherForCity,
    getWeatherForCities
};