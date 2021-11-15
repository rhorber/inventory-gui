# Inventory

> Little helper application to manage (cellar) inventory.

## About

This is a little inventory application I developed for my personal needs.
It lets you track articles/items and their stock.
The API is in my [inventory-api](https://github.com/rhorber/inventory-api) repository.

### Synchronisation

Because I have no mobile reception in my cellar, I added a very rudimentary synchronisation.
When offline the changes are stored locally, and when back online again a synchronisation option is offered.

I am aware, that the solution is very primitive and definitively not state of the art, but it suits our needs.
As I have little time to dive fully into the better APIs (i.e. IndexedDB),
and we are just two persons using it at the time, I chose this pragmatic approach.

## Icons

I'm using the Bytesize Icons from danklammer.
[GitHub Repo](https://github.com/danklammer/bytesize-icons/tree/master)

[comment]: <> (Version 1.4)

## Barcode Scanner

To enable the app to scan barcodes (EAN), I added the Html5-QRCode library from mebjas and contributors.
[GitHub Repo](https://github.com/mebjas/html5-qrcode)

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).
