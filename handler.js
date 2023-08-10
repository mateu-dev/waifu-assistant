const chrono = require("chrono-node");
const fs = require("fs");

const LIST_OF_COMMANDS = JSON.parse(fs.readFileSync("./commands.json"));
const CONFIG = JSON.parse(fs.readFileSync("./config.json"));

module.exports.handleRequest = async function (req) {
    req = decodeURIComponent(req.command);
    const time = chrono.parseDate(req);
    console.log(req);
    if (CONFIG.gpt.gpt_commands) {
        // Handle picking commands with gpt
        return;
    }
    let response = await fetch("http://localhost:8000/message?q=" + encodeURIComponent(req));
    response = await response.text();
    console.log(response);
    return response;
}


// Fix this later
function decodeUnicode(text) {
    decodeURIComponent(text)
    // return text.replace(/\\u[\dA-Fa-f]{4}|[^\\u]+/g, match => {
    //     if (match.startsWith("\\u")) {
    //         return String.fromCharCode(parseInt(match.substr(2), 16));
    //     } else {
    //         return eval('"' + match + '"');
    //     }
    // });
}