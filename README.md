# Introduction 
Being Funky

# Getting Started
Test local sample app:
    - cd test\sample
    - func azure functionapp fetch-app-settings <your func name>
    - func run template-functor

## Application settings
You will need to create a service principal to access your Function app.  Create a new service principle:

```bash
az ad sp create-for-rbac -n <name-of-service-principal> --scopes /subscriptions/<your-subscription-id>/resourceGroups/<your-resource-group->/providers/Microsoft.Web/sites/<function-app-name>  --role Owner
```

Your output will look like: 

```
{
  "appId": "xxxxxx-xxxx-xxxx-xxxx-6efb73bdxxxx",  //client id
  "displayName": "funkysp",
  "name": "http://funkysp",
  "password": "7408xxxx-xxxx-xxxx-xxxx-xxxxxx246cee", //client secret
  "tenant": "4648xxxx-xxxx-xxxx-xxxx-xxxx229cxxxx" // domain
}
```

You'll need to use that output to set your function app's application settings in order to connect to your desired function app. You can find an example settings file in `functions/example.settings.json`. 

You can make a copy of ```example.settings.json``` to ```local.settings.json``` by:

```
cp example.settings.json local.settings.json
```

Enter the following credentials in `local.settings.json`:

+ `FUNCTION_APP_NAME` - the name of your function app
+ `FUNCTION_APP_RESOURCE_GROUP` - the resource group of your function app
+ `SUBSCRIPTION_ID` -  the subscription id of your function app
+ `CLIENT_ID` - the application id of the service principal when it was created
+ `CLIENT_SECRET` - the password property returned to you when the service principal was created
+ `DOMAIN` - the tenant property returned to you when the service principal was created

# Build and Test

# Contribute
