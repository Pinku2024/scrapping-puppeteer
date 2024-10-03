const fs = require("fs");
const retrievePuppeteer = require('./retrieve_puppeteer')

// async function saveHtmlData(url, html, filename = 'html_data.csv') {
//     try {
//         if (!fs.existsSync(filename)) {
//             fs.writeFileSync(filename, 'URL,HTML Content\n', 'utf8');
//         }
//         const escapedHtml = html.replace(/"/g, '""');
//         const csvRow = `"${url}","${escapedHtml}"\n`;
//         fs.appendFileSync(filename, csvRow, 'utf8');

//         console.log(`Data for URL ${url} saved to ${filename}`);
//     } catch (error) {
//         console.error(`Failed to save data for URL ${url}:`, error);
//     }
// }

async function saveHtmlData(url, innerText, filename = 'text_content.csv') {
    try {
        // Ensure the file exists, if not create it with headers
        if (!fs.existsSync(filename)) {
            fs.writeFileSync(filename, 'URL,Text Content\n', 'utf8'); // CSV header
        }

        // Escape double quotes in innerText to prevent breaking CSV format
        const escapedText = innerText.replace(/"/g, '""');

        // Create a CSV row with URL and inner text
        const csvRow = `"${url}","${escapedText}"\n`;
        fs.appendFileSync(filename, csvRow, 'utf8');

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