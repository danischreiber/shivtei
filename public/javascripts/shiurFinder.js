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
const AWS = require('aws-sdk');

const s3 = new AWS.S3();


var $ = require('jquery')(window);

const AWS_URL = "https://elasticbeanstalk-us-east-2-560008700343.s3.us-east-2.amazonaws.com/shiurim/";
const ACCESS_TOKEN = "ya29.a0Ae4lvC1ANsJvHc2-v9UGjfe7POdFRy7kWvbYjqEUznTp_zYQH-1MShNXTgwANRyw7MGFrwi0oKg5PdGpuqVfG58RObiWc7b1Gk2BUMh_PMphwPRZFkmBwVPlIx8Gp1GUFrAwNk-2CQLN-wk3HgtmPRL8uSQERtHcdN0";
const DRIVE_URL = "https://www.googleapis.com/drive/v2/files?q='1ZVAZQdAt-deIeXteHUn2NC-WE43P2LXs' in parents";
let controller = {
    all: function() {
        let files = [];

        // fs.readdirSync('https://shiurim-public.s3.us-east-2.amazonaws.com/').forEach(file => {
        //     console.log(file);
        //     files.push(file);
        // });
        let shiurim = [];
        for (let i = 0; i < files.length; i++) {
            shiurim.push({
                author: files[i].split('%')[0].replace(/-/gi, ' '),
                title: files[i].split('%')[1]
            });
        }
        return shiurim;
    },

    driveAll: function(res) {
        const onSuccess = function(data) {
            const items = data.items;
            let shiurim = [];
            for(let i=0; i<items.length;i++){
                let item = items[i];
                let shiurProperties = {};
                if(item.properties){
                    for(let i=0;i<item.properties.length;i++){
                        shiurProperties[item.properties[i].key] = item.properties[i].value;
                    }
                }

                if(item.webContentLink){
                    shiurim.push({
                        title: shiurProperties.title || item.title,
                        downloadUrl: item.webContentLink,
                        author: shiurProperties.author,
                        streamUrl: item.webContentLink.replace('&export=download', '')
                    });
                }

            }
            res.render('shiur', {shiurim: shiurim});

            console.log("HERE");
        };

        $.ajax({
            url: DRIVE_URL,
            type: 'GET',
            headers: {"Authorization": "Bearer " + ACCESS_TOKEN},
            success: onSuccess
        });
    },

    awsAll: function(res) {
        var params = {
            Bucket: 'elasticbeanstalk-us-east-2-560008700343',
            // Region: 'us-east-2',
            Delimiter: '-',
            Prefix: 'shiurim'
        };

        s3.listObjectsV2(params, function (err, data) {

            if(err)throw err;
            const files = data.Contents;
            let shiurim = [];
            for (let i = 0; i < files.length; i++) {
                const key = files[i].Key;

                shiurim.push({
                    author: key.split('%')[0].replace(/-/gi, ' '),
                    title: key.split('%')[1],
                    url: AWS_URL + key
                });
            }
            res.render('shiur', {shiurim: shiurim});

        });
    }


};
module.exports = controller;