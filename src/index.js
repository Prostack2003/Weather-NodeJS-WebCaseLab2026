import process from 'node:process';
import { getWeatherForCities } from './services/weather.service.js';
import { printWeatherReport } from './format/weather.format.js';

const args = process.argv.slice(2);

function parseCities(value) {
    let parsedCities;

    if (value === undefined) {
        throw new Error('Вы не ввели ни одного города');
    } else if (value.startsWith('--')) {
        throw new Error('Вы пропустили значение города');
    } else {
        parsedCities = value.split(',');
        parsedCities = parsedCities
            .map((city) => city.trim())
            .filter((city) => city.length > 0);
    }

    if (parsedCities.length === 0) {
        throw new Error('Не указан город');
    }

    return parsedCities;
}

function parseDays(value) {
    let parsedDays = Number(value);

    if (value === undefined) {
        throw new Error('После --days укажите количество дней от 1 до 7');
    } else if (value.startsWith('--')) {
        throw new Error(
            'Вы пропустили день, введите количество дней - от 1 до 7'
        );
    } else if (!Number.isInteger(parsedDays)) {
        throw new Error('Введите целое число');
    } else if (parsedDays <= 0 || parsedDays >= 8) {
        throw new Error('Вы ввели некорректный день, введите день - от 1 до 7');
    }

    return parsedDays;
}

function parseArgs(args) {
    let cities = null;
    let days = 3;
    let noCache = false;

    for (let index = 0; index < args.length; index++) {
        const currentArg = args[index];

        if (currentArg === '--city') {
            cities = parseCities(args[index + 1]);
            index++;
        } else if (currentArg === '--days') {
            days = parseDays(args[index + 1]);
            index++;
        } else if (currentArg === '--no-cache') {
            noCache = true;
        } else {
            throw new Error(`Неизвестный параметр: ${currentArg}`);
        }
    }

    if (cities === null) {
        throw new Error('Не указан обязательный параметр: --city');
    }

    return {
        cities,
        days,
        noCache,
    };
}

async function main() {
    try {
        const { cities, days, noCache } = parseArgs(args);
        const results = await getWeatherForCities(cities, days, noCache);
        let hasErrors = false;
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                const { location, forecast } = result.value;
                printWeatherReport(location, forecast);
            } else if (result.status === 'rejected') {
                hasErrors = true;
                const city = cities[index];

                console.error(
                    `Ошибка для города ${city}: ${result.reason.message}`
                );
            }
        });
        if (hasErrors) {
            process.exitCode = 1;
        }
    } catch (error) {
        console.error(`Ошибка: ${error.message}`);
        process.exitCode = 1;
    }
}

await main();
