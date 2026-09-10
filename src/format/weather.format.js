function buildForecastRows(daily) {
    return daily.time.map((date, index) => {
        return {
            Дата: date,
            'Минимальная температура': daily.temperature_2m_min[index],
            'Максимальная температура': daily.temperature_2m_max[index],
            Осадки: daily.precipitation_sum[index],
        };
    });
}

function printWeatherReport(location, forecast) {
    console.log('');
    console.log(`Город: ${location.name}, ${location.country}`);
    console.log(`Координаты: ${location.latitude}, ${location.longitude}`);
    console.log(
        `Единицы измерения: температура — ${forecast.dailyUnits.temperature_2m_min}, осадки — ${forecast.dailyUnits.precipitation_sum}`
    );

    const rows = buildForecastRows(forecast.daily);
    console.table(rows);
}

export { buildForecastRows, printWeatherReport };
