const helpers = require('./../helpers/index.js');
const validator = require('validator');
const parser = require('cron-parser');
const handlebars = require('handlebars');


module.exports = function (context, req, functorTemplate) {
  const azFunc = helpers.functionFactory();

  if (!req.body) {
    context.res = { status: 400, body: 'must pass body' };
    context.done();
    return;
  }

  if (!req.body.funcName || validator.isEmpty(req.body.funcName)) {
    context.log("Invalid response");
    context.res = { status: 400, body: 'must pass funcName' };
    context.done();
    return;
  }

  if (!req.body.templateName || validator.isEmpty(req.body.templateName)) {
    context.log("Invalid response");
    context.res = { status: 400, body: 'must pass templateName' };
    context.done();
    return;
  }

  if (!req.body.schedule || validator.isEmpty(req.body.schedule)) {
    context.log("Invalid response");
    context.res = { status: 400, body: 'must pass schedule' };
    context.done();
    return;
  }

  try {
    var interval = parser.parseExpression(req.body.schedule);
  } catch (err) {
    context.log("Invalid response");
    context.res = { status: 400, body: 'must be valid cron schedule' };
    context.done();
    return;
  }

  const functionScript = createFunctionScript(req.body.templateName, functorTemplate, req.body.config);
  const triggerBinding = createTriggerBinding(req.body.funcName, req.body.schedule);

  azFunc.deployFunction(req.body.funcName, functionScript, triggerBinding)
    .then(func => {
      context.log(func);

      context.res = {
        headers: {
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Origin": '*',
          "Access-Control-Allow-Methods": "POST",
          'Content-Type': 'application/json'
        },
        status: 202,
        body: func
      };

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
