# Introduction 
Being Funky

# Getting Started
Test local sample app:
    - cd test\sample
    - func azure functionapp fetch-app-settings <your func name>
    - func run template-functor

## Application settings

You'll need to set your function app's application settings in order to connect to your desired function app. You can find an example settings file in `functions/example.settings.json`. Enter the following credentials in and save as `local.settings.json`:

+ `FUNCTION_APP_NAME` - the name of your function app.
+ `SUBSCRIPTION_ID` -  the subscription id of your function app
+ `CLIENT_ID` - the application id of the service principal when it was created
+ `CLIENT_SECRET` - the password property returned to you when the service principal was created
+ `DOMAIN` - the tenant property returned to you when the service principal was created

# Build and Test

# Contribute
