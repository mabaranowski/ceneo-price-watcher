const puppeteer = require('puppeteer');


async function filterLessThanEqual(url, goal) {
    const priceList = await scrapePrices(url);
    const fixedDelimiterPrices = priceList.map(price => price.replace(',', '.'));
    const filteredPriceList = fixedDelimiterPrices.filter(price => price <= goal);

    return filteredPriceList;
}

async function scrapePrices(url) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });    
    await page.click('.show-remaining-offers a').catch(err => {});
    await page.waitForTimeout(2000);

    const data = await page.evaluate( () => {
        const prices = document.querySelectorAll('.product-price .price');
        return Array.from(prices).map(el => el.innerText);
    });

    await browser.close();
    return data;
};

