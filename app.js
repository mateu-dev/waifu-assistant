const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');

const { exec } = require("child_process");

const assistant = require("./handler.js")

http.createServer(async (req, res) => {
    let request = url.parse(req.url, true);
    let pathname = request.pathname;

    if (pathname === '/handle')
        return res.end(await assistant.handleRequest(request.query))
    if (pathname === '/')
        pathname = "/index.html"
    try { res.end(fs.readFileSync(path.join(__dirname, `./${pathname}`))); } catch (e) { res.end("404") }
}).listen(8080, () => {
    exec("python ./gpt/gpt_api.py");
});