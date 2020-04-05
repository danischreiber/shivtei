"use strict";
const fs = require('fs');
// const finder = require('findit').find(__dirname);
var http = require('http');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
const ejs = require('ejs');
global.document = document;

var $ = require('jquery')(window);

let controller = {
    all: function() {
        let files = [];
        fs.readdirSync('./public/shiurim').forEach(file => {
            console.log(file);
            files.push(file);
        });
        let shiurim = [];
        for (let i = 0; i < files.length; i++) {
            shiurim.push({
                author: files[i].split('%')[0].replace(/-/gi, ' '),
                title: files[i].split('%')[1]
            });
        }
        return shiurim;
    }
};
module.exports = controller;