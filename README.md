# ceneo-price-watcher

## Description
This project scrapes prices from **Ceneo**.  
You supply a link to the product, set the target price and run the app.

It visits the site every hour, and it notifies the user if it finds a price that matches, or is lower than provided target.  
If there are multiple offers, that match the criteria, it returns the cheapest.

Notifications are done through **Pushover**.  
After successful match, it removes that product from the watch list.  
If multiple products are watched, the program will exit after it finds the last product.

## Install
```
$ npm install
```
## Run
```
$ node app.js
```

## Lightweight mode
While deploying this app onto resource restricted system, it is possible to use a lightweight version.  
It does not download chromium into node_modules, but uses on device version.  
The timeout on page load is also extended. On Raspberry Pi Zero W it takes around 1 minute to run the browser and open the page.  
```
$ npm uninstall puppeteer

$ npm install puppeteer-core

$ node appLite.js
```

## Tip
When using pm2 to start a background node process it is reccomended to use **--no-autorestart** flag.
```
$ pm2 start appLite.js --no-autorestart
```
