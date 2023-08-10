const chrono = require("chrono-node");
const fs = require("fs");

const LIST_OF_COMMANDS = JSON.parse(fs.readFileSync("./commands.json"));
const CONFIG = JSON.parse(fs.readFileSync("./config.json"));

for (const command of LIST_OF_COMMANDS)
    command.regex = generateRegExpAndExtractors(command.commands[0]);

module.exports.handleRequest = async function (input) {
    input = decodeURIComponent(input.command);
    const time = chrono.parseDate(input);
    console.log(input);
    if (CONFIG.gpt.gpt_commands) {
        // Handle picking commands with gpt
        return;
    }

    const current_command = LIST_OF_COMMANDS.find((command) => { return command.regex.regex.test(input) })
    current_command.variables = current_command.regex.extractors(input);
    console.log(current_command)

    let response = "gpt not enabled";
    if (CONFIG.gpt.enabled) {
        response = await fetch("http://localhost:8000/message?q=" + encodeURIComponent(input));
        response = await response.text();
    }

    // console.log(response);
    return response;
}

function generateRegExpAndExtractors(template) {
    const variables = [];
    const regexString = template.replace(/<([^>]+)>/g, (_, variable) => {
        variables.push(variable);
        return "(.*?)";
    });

    const regex = new RegExp(`^${regexString}$`);

    return {
        regex,
        extractors: input => {
            const match = input.match(regex);
            if (match) {
                return variables.reduce((result, variable, index) => {
                    result[variable] = match[index + 1];
                    return result;
                }, {});
            } else {
                return null;
            }
        }
    };
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