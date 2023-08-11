const chrono = require("chrono-node");
const fs = require("fs");

const LIST_OF_COMMANDS = JSON.parse(fs.readFileSync("./commands.json"));
const CONFIG = JSON.parse(fs.readFileSync("./config.json"));

for (const command of LIST_OF_COMMANDS)
    command.regex = generateRegExpAndExtractors(command.templates[0]);

module.exports.handleRequest = async function (input) {
    input = decodeURIComponent(input.command);
    let response = ""
    console.log(input);
    if (CONFIG.gpt.gpt_commands) {
        // Handle picking commands with gpt
        return;
    }

    const current_command = LIST_OF_COMMANDS.find((command) => { return command.regex.regex.test(input) })
    if (current_command) {
        current_command.variables = current_command.regex.extractors(input);
        switch (current_command.name) {
            case "reminder":
                const mentioned_time = chrono.parseDate(current_command.variables.TIME);

                new Reminder(mentioned_time, current_command);

                response = `Setting reminder for ${current_command.variables.THING} ${current_command.variables.TIME}`;
                break;
        }
    }

    console.log(current_command)

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

//--------------
class Reminder {
    constructor(timestamp, command) {
        const schedule = require("node-schedule");
        const notifier = require("node-notifier");
        schedule.scheduleJob(new Date(timestamp), () => {
            notifier.notify({
                title: 'Reminder',
                message: command.variables.THING
            })
        })
    }
}