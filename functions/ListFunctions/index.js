const helpers = require('./../helpers/');

module.exports = function (context, req) {
  const azFunctions = helpers.functionFactory();

  azFunctions.listFunctions()
    .then(functionList => {
      // fish out only timed functions
      const timerTriggers = helpers.findFunctionsByType('timerTrigger', functionList);

      context.res = {
        body: JSON.stringify(timerTriggers)
      };

      context.done();
    }).catch(reason => {
      context.res = {
        status: 500,
        error: reason.message
      };
      context.done();
    });
}

