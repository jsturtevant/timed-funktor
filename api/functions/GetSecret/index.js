const helpers = require('./../helpers/index.js');

module.exports = function (context, req) {
    const azFunc = helpers.functionFactory();
    azFunc.getSecret = 
        function(name){
            var requestUrl = this._buildBaseUrl();
            requestUrl = requestUrl + '/providers/Microsoft.Web/sites/' + this.functionAppName + '/functions/' + name + '/listsecrets';
            return this._performRequest(requestUrl,"POST",{})           
        }

    const functee = "./../template/index.js";
    const schedule = "0 */1 * * * *";
    // const name = req.body.funcName;
    const name = 'HttpTriggerJS1';

    azFunc.getSecret(name)
    .then(func => {
      key = func.key;
      context.log(key);

      context.res = {
        headers: {
          'Content-Type': 'application/json'
        },
        status: 202,
        body: key
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

  
  