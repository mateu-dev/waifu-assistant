const chrono = require("chrono-node");
const fs = require("fs");

const LIST_OF_COMMANDS = fs.readFileSync()

module.exports.handleRequest = async function (req) {
    req = decodeURIComponent(req.command);
    const time = chrono.parseDate(req);
    let response = await fetch("http://localhost:8000/message?q=" + encodeURIComponent(req));
    console.log(req);
    response = decodeUnicode(await response.text());
    console.log(response);
    return response;
}

function decodeUnicode(text) {
    return text.replace(/\\u[\dA-Fa-f]{4}|[^\\u]+/g, match => {
        if (match.startsWith("\\u")) {
            return String.fromCharCode(parseInt(match.substr(2), 16));
        } else {
            return eval('"' + match + '"');
        }
    });
}