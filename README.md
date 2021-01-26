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
