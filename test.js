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

const template = "set reminder <TIME> for <THING>";
const { regex, extractors } = generateRegExpAndExtractors(template);

const inputString = "set reminder 3:00 PM for meeting";
const extractedVariables = extractors(inputString);

if (extractedVariables) {
  console.log("Matched!");
  console.log("Extracted variables:", extractedVariables);
} else {
  console.log("Not matched!");
}