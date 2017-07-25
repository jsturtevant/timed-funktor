const helpers = require('./../helpers/');

module.exports = function (context, req) {
  const azFunc = helpers.functionFactory();

  if (typeof req.body == 'undefined' && typeof req.body != 'object') {
    statusCode = 400;
    responseBody = "Invalid Request";
    context.done();
    return;
  }

  const functee = "./../template/index.js";
  const schedule = "0 */1 * * * *";
  azFunc.deployFunction('functionname',
    `module.exports = require(${functee})`, [
      {
        "name": "myTimer",
        "type": "timerTrigger",
        "direction": "in",
        "schedule": schedule
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
      context.done();
    });
};
