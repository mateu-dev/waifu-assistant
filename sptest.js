const SpotifyWebApi = require('spotify-web-api-node');
const SpotifyAuth = require('./server/spotify/authorize.js')
const fs = require('fs');

const CONFIG = JSON.parse(fs.readFileSync("./server/config/config.json"));

const app = async () => {
    const spotifyApi = new SpotifyWebApi({
        clientId: '7884eee0fb874409a0e591e522e87e26',
        clientSecret: '60724de552b54c94b249eef33c098d0e',
        redirectUri: `http://localhost:${CONFIG.spotify.redirect_uri_port}/`
    });

    const tokens = await SpotifyAuth.getToken()
    spotifyApi.setAccessToken(tokens.accessToken);

    // Play a track
    spotifyApi.play({
        uris: ['spotify:track:TRACK_ID']
    }).then(() => {
        console.log('Playback started');
    }).catch((err) => {
        console.error('Error starting playback:', err);
    });
}

app()