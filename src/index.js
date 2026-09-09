import { argv } from 'node:process';

const args = argv.slice(2);

function parseArgs(args) {
    let cities = null;
    let days = 3;
    let noCache = false;

    for (let index = 0; index < args.length; index++) {
        const currentArg = args[index];

        if (currentArg === '--city') {
            cities = args[index + 1].split(',');
            cities = cities.map((city) => city.trim());
            index++
        }
        if (currentArg === '--days') {
            days = Number(args[index + 1]);
            index++
        }
        if (currentArg === '--no-cache') {
            noCache = true;
        }
    }

    if (cities === null) {
        throw new Error('Не указан обязательный параметр: --city');
    }

    return {
        cities,
        days,
        noCache,
    }
}

console.log(parseArgs(args));