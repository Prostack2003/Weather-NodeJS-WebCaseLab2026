import dotenv from 'dotenv';
import process from 'node:process';

dotenv.config({ quiet: true });

const DEFAULT_TIMEOUT_MS = 5000;

const requestTimeoutMs = Number(process.env.REQUEST_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS);
const geocodingBaseUrl = process.env.GEOCODING_BASE_URL;
const forecastBaseUrl = process.env.FORECAST_BASE_URL;

export {
    requestTimeoutMs,
    geocodingBaseUrl,
    forecastBaseUrl,
};