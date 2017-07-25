var test = require('tape');
var td = require('testdouble');

var funcHarness = require('azure-functions-node-harness');
var helpers = td.replace('../functions/helpers/index.js');

test('Create functions Tests', function (group) {
    var funcToTest = funcHarness('CreateFunction', { dirname: '../functions' });

    group.test('if templateName is empty then return status 400', function (t) {
        t.plan(1);

        funcToTest.invokeHttpTrigger({
            reqBody: {
                "templateName": ""
            }
        }).then(context => {
            t.equal(400, context.res.status);
        }).catch(err => {
            t.fail(`something went wrong: ${err}`);
        });
    });

    group.test('if templateName is null then return status 400', function (t) {
        t.plan(1);

        funcToTest.invokeHttpTrigger({
            reqBody: {
                "templateName": null
            }
        }).then(context => {
            t.equal(400, context.res.status);
        }).catch(err => {
            t.fail(`something went wrong: ${err}`);
        });
    });

    group.end();
});