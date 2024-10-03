const puppeteer = require('puppeteer');

const scrollPage = async (page, scrollCount = 3, scrollDelay = 1000) => {
    for (let i = 0; i < scrollCount; i++) {
        await page.evaluate(() => {
            window.scrollBy(0, window.innerHeight); // Scrolls down by one viewport height
        });
        await new Promise(resolve => setTimeout(resolve, scrollDelay)); // Wait for the specified delay between scrolls
    }
};

const retrievePuppeteer = async (url) => {
    const browser = await puppeteer.launch({
        headless: false, // Set to false to view browser action
    });

    const page = await browser.newPage();

    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Connection': 'keep-alive',
        });

        await page.goto(url, { waitUntil: "networkidle0" });
        await page.waitForSelector('body');

        // Scroll the page 3 times
        await scrollPage(page, 3, 1000); // Scrolls 3 times with a 1-second delay between each scroll

        const textContent = await page.evaluate(() => {
            return document.body.textContent; // Extract text content from the body
        });

        return textContent;

    } catch (error) {
        console.log('Error:', error.message);
        return null;
    } finally {
        await browser.close();
    }
};




module.exports = retrievePuppeteer;
