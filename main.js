const fs = require("fs");
const retrievePuppeteer = require('./retrieve_puppeteer')





async function saveHtmlData(url, innerText, filename = 'text_content.tsv') {
    try {
        // Ensure the file exists, if not create it with headers
        if (!fs.existsSync(filename)) {
            fs.writeFileSync(filename, 'URL\tText Content\n', 'utf8'); // TSV header
        }

        // Escape tabs and newlines in the innerText to prevent breaking TSV format
        const escapedText = innerText.replace(/\t/g, '    ').replace(/\n/g, ' '); // Replace tabs with spaces and newlines with spaces

        // Create a TSV row with URL and inner text
        const tsvRow = `${url}\t${escapedText}\n`;
        fs.appendFileSync(filename, tsvRow, 'utf8');

        console.log(`Data for URL ${url} saved to ${filename}`);
    } catch (error) {
        console.error(`Failed to save data for URL ${url}:`, error);
    }
}





function saveErrorLog(error, url, filename = "error_log.txt") {
    try {
        fs.appendFile(filename, `Error for this URL: ${url}\nError: ${error}\n\n`, (err) => {
            if (err) throw err;
            console.log('Error log appended to error_log.txt');
        });
    } catch (err) {
        console.error('Error occurred while saving error log:', err);
    }
}


async function mainFunction(url) {
    try {
        const response = await retrievePuppeteer(url);
        await saveHtmlData(url, response);
    } catch (error) {
        saveErrorLog(error, url)
        console.log(error);
    }
}
async function processURLs(url) {
    const startTime = process.hrtime();
    await mainFunction(url);
    const endTime = process.hrtime(startTime);
    const executionTimeInSeconds = (endTime[0] + endTime[1] / 1e9);
    // console.log(executionTimeInSeconds);
    fs.appendFile('execution_time.txt', `URL: ${url} --- execution time: ${executionTimeInSeconds} seconds\n`, (err) => {
        if (err) throw err;
        console.log('Execution time appended to execution_time.txt');
    });
}
async function readJsonFileInChunks(filePath) {
    try {
        const rawData = fs.readFileSync(filePath);
        const jsonData = JSON.parse(rawData);
        const urls = jsonData.urls;
        for (let i = 0; i < urls.length; i++) {
            await processURLs(urls[i]);
        }
    } catch (error) {
        console.error('Error reading file:', error);
    }
}

readJsonFileInChunks(filePath = './test_urls.json');

module.exports = readJsonFileInChunks