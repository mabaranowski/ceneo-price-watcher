const puppeteer = require('puppeteer');
const axios = require('axios');

const items = [
    {
        name: '',
        goal: 0,
        url: ''
    }
];

const interval = setInterval(watchPrices, 60 * 1000 * 60);

function watchPrices() {
    items.forEach(async item => {
        const offers = await filterLessThanEqual(item.url, item.goal);
        if(offers.length !== 0) {
            const cheapest = Math.min(...offers);
            const message = `${item.name} was found for ${cheapest}zl`;
            await sendNotification(message, item.url);

            updateItems(item);
        }
    });
}

function updateItems(item) {
    const index = items.map(ogItem => { 
        return ogItem.name; 
    }).indexOf(item.name);

    items.splice(index, 1);

    if(items.length === 0) {
        clearInterval(interval);
    }
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
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
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
