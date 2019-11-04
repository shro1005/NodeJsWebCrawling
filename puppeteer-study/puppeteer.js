const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const puppeteer = require('puppeteer-study/puppeteer');

const csv = fs.readFileSync('csv_puppeteer/data.csv');