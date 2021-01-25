const puppeteer = require('puppeteer');
const axios = require('axios');

const items = [
    {
        name: '',
        goal: 0,
        url: ''
    }
];

const interval = setInterval(watchPrices, 1 * 1000 * 60);

function watchPrices() {
    items.forEach(async item => {
        const offers = await filterLessThanEqual(item.url, item.goal);
        if(offers.length !== 0) {
            const cheapest = Math.min(...offers);
            const message = `${item.name} was found for ${cheapest}zl`;
            await sendNotification(message, item.url);
            clearInterval(interval);
        }
    });
}

async function sendNotification(message, url) {
    await axios.post('', 
    {
        token: '',
        user: '',
        message: message,
        url: url
    });
}

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
}

