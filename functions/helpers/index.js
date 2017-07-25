const AzureFunctions = require('azure-functions');

module.exports = {
  functionFactory = function () {
    return new AzureFunctions(process.env.RESOURCE_GROUP,
      process.env.FUNCTION_APP_NAME, {
        subscriptionId: process.env.SUBSCRIPTION_ID,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        domain: process.env.AD_DOMAIN
      }
    );
  },

  findFunctionsByType = function(type, list) {
    return list.filter(func => {
      const config = func.properties.config;
      const filteredList = config.bindings.filter(binding => binding.type === type);
      const hasBindingOfType = filteredList.length > 0;
      return hasBindingOfType;
    };
  }
};
