const helpers = require('./../helpers/index.js');

module.exports = function (context, req) {
  const azFunc = helpers.functionFactory();

  if (req.method === "OPTIONS") {
    context.res = {
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Methods": "DELETE, OPTIONS"
      },
      status: 200,
      body: {}
    };
    context.done();
    return;
  }

  if (!req.params.funcName) {
    context.log("Invalid response");
    context.res = { status: 400, body: 'must pass function name' };
    context.done();
    return;
  }

  const functee = "./../template/index.js";
  const schedule = "0 */1 * * * *";
  const name = req.params.funcName;

  azFunc.deleteFunction(name)
    .then(func => {

      context.log(func);

      context.res = {
        headers: {
          'Content-Type': 'application/json',
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Origin": '*',
          "Access-Control-Allow-Method": "DELETE"
        },
        status: 202,
        body: {}
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


