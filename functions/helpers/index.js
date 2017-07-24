const AzureFunctions = require('azure-functions');

module.exports = {
    functionFactory = function () {
        return new AzureFunctions(process.env.RESOURCE_GROUP,
            process.env.FUNCTION_APP_NAME, {
                subscriptionId: process.env.SUBSCRIPTION_ID,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                domain: process.env.AD_DOMAIN
            });
    }
}