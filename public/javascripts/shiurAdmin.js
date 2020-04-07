var http = require('http');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
const $ = require('jquery')(window);
const {google} = require('googleapis');
const ACCESS_TOKEN = "ya29.a0Ae4lvC1ANsJvHc2-v9UGjfe7POdFRy7kWvbYjqEUznTp_zYQH-1MShNXTgwANRyw7MGFrwi0oKg5PdGpuqVfG58RObiWc7b1Gk2BUMh_PMphwPRZFkmBwVPlIx8Gp1GUFrAwNk-2CQLN-wk3HgtmPRL8uSQERtHcdN0";
const fs = require('fs');
const readline = require('readline');


const SCOPES = [
    'https://www.googleapis.com/auth/drive.file'
];


let controller = {
    auth: function(file, callback) {
        const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
        fs.readFile('credentials.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Drive API.
            authorize(JSON.parse(content), function(auth){
                callback(auth, file);
            });
        });

        /**
         * Create an OAuth2 client with the given credentials, and then execute the
         * given callback function.
         * @param {Object} credentials The authorization client credentials.
         * @param {function} callback The callback to call with the authorized client.
         */
        function authorize(credentials, callback) {
            const {client_secret, client_id, redirect_uris} = credentials.installed;
            const oAuth2Client = new google.auth.OAuth2(
                client_id, client_secret, redirect_uris[0]);

            // Check if we have previously stored a token.
            fs.readFile(TOKEN_PATH, (err, token) => {
                if (err) return getAccessToken(oAuth2Client, callback);
                oAuth2Client.setCredentials(JSON.parse(token));
                callback(oAuth2Client);
            });
        }

        /**
         * Get and store new token after prompting for user authorization, and then
         * execute the given callback with the authorized OAuth2 client.
         * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
         * @param {getEventsCallback} callback The callback for the authorized client.
         */
        function getAccessToken(oAuth2Client, callback) {
            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES,
            });
            console.log('Authorize this app by visiting this url:', authUrl);
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            rl.question('Enter the code from that page here: ', (code) => {
                rl.close();
                oAuth2Client.getToken(code, (err, token) => {
                    if (err) return console.error('Error retrieving access token', err);
                    oAuth2Client.setCredentials(token);
                    // Store the token to disk for later program executions
                    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                        if (err) return console.error(err);
                        console.log('Token stored to', TOKEN_PATH);
                    });
                    callback(oAuth2Client);
                });
            });
        }
    },

    create: function(auth, file){
        var fileMetadata = {
            'name': file.path
        };
        var media = {
            mimeType: 'image/jpeg',
            body: fs.createReadStream(file.path),
            properties: {
                "author": "AUth1",
                "title": "tit1"
            }
        };
        const drive = google.drive({version: 'v3', auth});

        drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id'
        }, function (err, file) {
            if (err) {
                // Handle error
                console.error(err);
            } else {
                console.log('File Id: ', file.id);
            }
        });
    },

    uploadFileDrive: function(file, props){

        const auth = this.auth(file, this.create);
        // this.create(auth, file);
    }
};
module.exports = controller;