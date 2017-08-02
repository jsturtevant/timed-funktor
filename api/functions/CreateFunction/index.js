const helpers = require('./../helpers/index.js');
const validator = require('validator');
const parser = require('cron-parser');
const handlebars = require('handlebars');


module.exports = function (context, req, functorTemplate) {
  const azFunc = helpers.functionFactory();

  const errorMessage =  validate(req.body);
  if(errorMessage){
      context.res = errorMessage;
      context.done();
      return;
  }

  const functionScript = createFunctionScript(req.body.templateName, functorTemplate, req.body.config);
  const triggerBinding = createTriggerBinding(req.body.funcName, req.body.schedule);

  azFunc.deployFunction(req.body.funcName, functionScript, triggerBinding)
    .then(func => {
      context.log(func);

      context.res.status(202).json(func);

      context.done();
    })
    .catch(err => {
      context.log(err);

      context.res = {
        headers: {
          'Content-Type': 'application/json'
        },
        status: 500,
        error: err.message
      };

      context.done();
    });
};

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

function validate(body){
  if (!body) {
    return { status: 400, body: 'must pass body' };
  }

  if (!body.funcName || validator.isEmpty(body.funcName)) {
    return { status: 400, body: 'must pass funcName' };
  }

  if (!body.templateName || validator.isEmpty(body.templateName)) {
    return { status: 400, body: 'must pass templateName' };
  }

  if (!body.schedule || validator.isEmpty(body.schedule)) {
    return { status: 400, body: 'must pass schedule' };
  }

  try {
    var interval = parser.parseExpression(body.schedule);
  } catch (err) {
    return { status: 400, body: 'must be valid cron schedule' };
  }
  return;
}