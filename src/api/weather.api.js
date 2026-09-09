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

export { buildGeocodingUrl, geocodeCity };