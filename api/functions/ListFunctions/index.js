const helpers = require('./../helpers/');

module.exports = function (context, req) {
  const azFunctions = helpers.functionFactory();

  azFunctions.listFunctions()
    .then(functionList => {
      // fish out only timed functions
      // const timerTriggers = helpers.findFunctionsByType('timerTrigger', functionList);

      context.res = {
        headers: {
          'Content-Type': 'application/json',
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Origin": '*',
          "Access-Control-Allow-Methods": "GET"
        },
        body: functionList 
      };

      context.done();
    }).catch(reason => {
      context.res = {
        headers: {
          'Content-Type': 'application/json'
        },
        status: 500,
        error: reason.message
      };
      context.done( );
    });
}

