function personalizeMessage({ message, customer }) {
  return message.replace(/{(.*?)}/g, (_, key) => {
    return customer[key] || '';
  });
}

function addDataToWhatsAppTemplate({ body, variables, customer }) {
  return body.replace(/{{(\d+)}}/g, (_, index) => {
    const key = variables[index - 1];
    return customer[key] || '';
  });
}

function addDataToWhatsAppPrompt({ prompt, customer }) {
  if (!prompt) return '';

  return prompt.replace(/{(.*?)}/g, (_, key) => {
    return customer[key] || '';
  });
}

function getVariablesWhatsPrompt({ prompt, customer }) {
  const variables = {};

  prompt.replace(/{(.*?)}/g, (match, key) => {
    variables[key] = customer[key] || '';
    return match;
  });

  return variables;
}

module.exports = {
  personalizeMessage,
  addDataToWhatsAppTemplate,
  addDataToWhatsAppPrompt,
  getVariablesWhatsPrompt
};
