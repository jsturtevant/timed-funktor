const helpers = require('./../helpers/index.js');

module.exports = function (context, req) {
    const azFunc = helpers.functionFactory();
    azFunc.enableFunction = 
        function(name){
            var requestUrl = this._buildBaseUrl();
            requestUrl = requestUrl + '/providers/Microsoft.Web/sites/' + this.functionAppName + '/functions/' + name;
            return this._performRequest(requestUrl)
                .then(functionListing => {
                    props = functionListing.properties;
                    // conf = props.config;
                    props.config.disabled = false;
                    return this._performRequest(requestUrl,'PUT',{properties:props});
                });
        }

    // if (!req.body.templateName || validator.isEmpty(req.body.templateName)){
    //     context.log("Invalid response");
    //     context.res = { status: 400, body: 'must pass template' }; 
    //     context.done();
    //     return;
    // } 
    // if (!req.body.funcName){
    //   context.log("Invalid response");
    //     context.res = { status: 400, body: 'must pass function name' }; 
    //     context.done();
    //     return;
    // }

    const functee = "./../template/index.js";
    const schedule = "0 */1 * * * *";
    // const name = req.body.funcName;
    const name = 'HttpTriggerJS1';

    azFunc.enableFunction(name)
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

  
  