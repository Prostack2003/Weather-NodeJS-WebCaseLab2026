import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

function formatTwoDigits(value) {
    return value < 10 ? `0${value}` : `${value}`;
}

function formatDate(date = new Date()) {
    const year = date.getFullYear();
    const month = formatTwoDigits(date.getMonth() + 1);
    const day = formatTwoDigits(date.getDate());

    return `${year}-${month}-${day}`;
}

function buildReportPath(city, date, reportsDir = 'reports') {
    return join(reportsDir, `${city}-${date}.json`);
}

async function saveReport(filePath, report) {
    const reportDirectory = dirname(filePath);

    await mkdir(reportDirectory, { recursive: true });

    const json = JSON.stringify(report, null, 2);

    await writeFile(filePath, json, 'utf8');
}

async function readReport(filePath) {
    try {
        const json = await readFile(filePath, 'utf8');

        return JSON.parse(json);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return null;
        }

        throw error;
    }
}

export { buildReportPath, formatDate, saveReport, readReport };
