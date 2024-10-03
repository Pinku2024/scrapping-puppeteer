// import puppeteer from 'puppeteer';
const puppeteer = require('puppeteer')

async function scrollPage(page, delay = 1000) {
    await page.evaluate(async (delay) => {
        let count = 1
        console.log('Count first', count);
        // Scroll down to the bottom of the page
        await new Promise((resolve) => {
            const totalHeight = 0;
            const distance = 300; // Distance to scroll on each iteration
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                console.log('scroll', scrollHeight);

                // const scrollHeight = 100;
                window.scrollBy(0, distance);
                totalHeight += distance;
                count += 1

                // If we've scrolled to the bottom, stop the interval
                console.log('Count', count);
                if (totalHeight >= scrollHeight || count >= 3) {

                    clearInterval(timer);
                    resolve();
                }
            }, delay);
        });
    }, delay);
}

const retrievePuppeteer = async (url) => {

    const browser = await puppeteer.launch({
        headless: false,
        // executablePath: '/usr/bin/chromium-browser', // server side puppeteer
        // args: ['--no-sandbox']
    })

    const page = await browser.newPage();

    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        // await page.setViewport({ width: 1280, height: 800 });
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Connection': 'keep-alive',
        });
        // await page.goto(url, { waitUntil: "load" });
        // const htmlContent = await page.content();
        //console.log(htmlContent)
        // return htmlContent
        await page.goto(url, { waitUntil: "networkidle0" });
        await page.waitForSelector('body');
        await scrollPage(page, 200)
        const textContent = await page.evaluate(async () => {
            // await window.scrollBy(0, 1000);
            return document.body.textContent; // Extract text content from the body
        });
        return textContent;

        // const innerText = await page.evaluate(() => {
        //     return document.body.innerText.trim(); // Get the inner text of the body
        // });
        // return innerText

    } catch (error) {
        console.log('Error:', error.message);
        await browser.close();
        return null;
    } finally {
        await browser.close();
    }
}
module.exports = retrievePuppeteer;
