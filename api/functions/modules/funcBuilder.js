const handlebars = require('handlebars');

module.exports = function (funcInfo, functorTemplate) {
  const functionScript = createFunctionScript(funcInfo.templateName, functorTemplate, funcInfo.config);
  const triggerBinding = createTriggerBinding(funcInfo.funcName, funcInfo.schedule);

  return {
    functionName: funcInfo.funcName,
    functionScript: functionScript,
    triggerBinding: triggerBinding
  }
}

function createTriggerBinding(funcName, schedule) {
  return [
    {
      "name": funcName,
      "type": "timerTrigger",
      "direction": "in",
      "schedule": schedule
    }
  ];
}

function createFunctionScript(templateName, functorTemplate, config = {}) {
  const template = handlebars.compile(functorTemplate);
  const functee = `./../${templateName}`;
  return template({ templateName: functee, config: JSON.stringify(config) });
}