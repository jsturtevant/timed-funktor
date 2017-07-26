const helpers = require('./../helpers/index.js');
const validator = require('validator');
const parser = require('cron-parser');


module.exports = function (context, req) {
  const azFunc = helpers.functionFactory();

  if (!req.body.templateName || validator.isEmpty(req.body.templateName)){
        context.log("Invalid response");
        context.res = { status: 400, body: 'must pass template' }; 
        context.done();
        return;
  }

  if (!req.body.schedule || validator.isEmpty(req.body.schedule)){
    context.log("Invalid response");
    context.res = { status: 400, body: 'must pass schedule' }; 
    context.done();
    return;
  }

  try{
    var interval = parser.parseExpression(req.body.schedule);
  }catch(err){
    context.log("Invalid response");
    context.res = { status: 400, body: 'must valid cron schedule' }; 
    context.done();
    return;
  }

  const functee = `"./../template-${req.body.templateName}"`;

  azFunc.deployFunction(req.body.templateName,
    `module.exports = require(${functee})`, [
      {
        "name": req.body.templateName,
        "type": "timerTrigger",
        "direction": "in",
        "schedule": req.body.schedule
      }
    ])
    .then(func => {
      context.log(func);

      context.res = {
        headers: {
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
