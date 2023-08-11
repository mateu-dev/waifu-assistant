const { exec } = require('child_process');
const http = require('http');
const url = require('url');
const fs = require('fs');
const axios = require('axios');


const CONFIG = JSON.parse(fs.readFileSync("./server/config/config.json"));

module.exports.getToken = async function () {
    return new Promise((resolve, reject) => {
        const server = http.createServer(async (req, res) => {
            const request = url.parse(req.url, true);
            const code = request.query.code;

            const tokenEndpoint = 'https://accounts.spotify.com/api/token';

            const data = new URLSearchParams();
            data.append('grant_type', 'authorization_code');
            data.append('code', code);
            data.append('redirect_uri', `http://localhost:${CONFIG.spotify.redirect_uri_port}/`);

            const headers = {
                'Authorization': `Basic ${Buffer.from(`${CONFIG.spotify.client_id}:${CONFIG.spotify.client_secret}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            };

            try {
                const response = await axios.post(tokenEndpoint, data, { headers });
                const accessToken = response.data.access_token;
                const refreshToken = response.data.refresh_token; // If provided

                // Close the server
                server.close();

                resolve({ accessToken, refreshToken }); // Resolve the promise with tokens
            } catch (error) {
                // Close the server
                server.close();

                reject(error); // Reject the promise with an error
            }
        }).listen(CONFIG.spotify.redirect_uri_port, () => {
            exec(`start https://accounts.spotify.com/authorize?client_id=${CONFIG.spotify.client_id}"&"response_type=code"&"redirect_uri=http://localhost:${CONFIG.spotify.redirect_uri_port}/"&"scope=user-read-private%20user-read-email"&"state=STATE`);
        });
    });
}
