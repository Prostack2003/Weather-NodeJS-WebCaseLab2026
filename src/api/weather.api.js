function buildGeocodingUrl(city) {
    const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
    url.searchParams.set('name', city);
    url.searchParams.set('count', '1');
    url.searchParams.set('language', 'ru');
    url.searchParams.set('format', 'json');

    return url.toString();

}

async function geocodeCity(city) {
    const url = buildGeocodingUrl(city);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Ошибка API геокодинга: HTTP ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data.results) && data.results.length > 0) {
        const location = data.results[0];

        return {
            name: location.name,
            country: location.country,
            latitude: location.latitude,
            longitude: location.longitude,
        }
    } else {
        throw new Error(`Город "${city}" не найден`);
    }
}


function buildForecastUrl(latitude, longitude, days) {
    const url = new URL('/v1/forecast', 'https://api.open-meteo.com');
    url.searchParams.set('latitude', latitude);
    url.searchParams.set('longitude', longitude);
    url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_sum');
    url.searchParams.set('forecast_days', days);
    url.searchParams.set('timezone', 'auto');

    return url.toString();
}

async function getForecast(latitude, longitude, days) {
    const url = buildForecastUrl(latitude, longitude, days);

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Ошибка API: HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.daily || !data.daily_units) {
        throw new Error('API прогноза вернул данные неизвестного формата');
    }

    return {
        daily: data.daily,
        dailyUnits: data.daily_units,
    }
}

export {
    buildGeocodingUrl,
    geocodeCity,
    buildForecastUrl,
    getForecast,
};