import { geocodeCity, getForecast } from '../api/weather.api.js';
import { reportsDir } from '../config.js';
import {
    buildReportPath,
    formatDate,
    readReport,
    saveReport,
} from '../storage/report.storage.js';

async function getWeatherForCity(city, days, noCache = false) {
    if (!noCache) {
        const cachedWeather = await readCachedWeather(city);

        if (isValidCachedWeather(cachedWeather, days)) {
            return cachedWeather;
        }
    }
    const location = await geocodeCity(city);

    const forecast = await getForecast(
        location.latitude,
        location.longitude,
        days
    );

    const weatherReport = {
        date: formatDate(),
        requestedDays: days,
        location,
        forecast,
    };

    const reportPath = buildReportPath(city, weatherReport.date, reportsDir);

    await saveReport(reportPath, weatherReport);

    return weatherReport;
}

async function getWeatherForCities(cities, days, noCache = false) {
    const requests = cities.map((city) => {
        return getWeatherForCity(city, days, noCache);
    });

    return Promise.allSettled(requests);
}

async function readCachedWeather(city) {
    const dateNow = formatDate();
    const path = buildReportPath(city, dateNow, reportsDir);
    return readReport(path);
}

function isValidCachedWeather(cachedWeather, days) {
    if (cachedWeather === null) {
        return false;
    } else if (cachedWeather.requestedDays !== days) {
        return false;
    } else if (!cachedWeather.location) {
        return false;
    } else if (!cachedWeather.forecast) {
        return false;
    }

    return true;
}

export {
    getWeatherForCity,
    getWeatherForCities,
    readCachedWeather,
    isValidCachedWeather,
};
