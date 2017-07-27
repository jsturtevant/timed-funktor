var test = require('tape');
var td = require('testdouble');

var funcHarness = require('azure-functions-node-harness');
var helpers = td.replace('../functions/helpers/index.js');

test('Create functions Tests', function (group) {
  var funcToTest = funcHarness('CreateFunction', { dirname: '../functions' });

  const deployFunc = td.function();
  td.when(helpers.functionFactory()).thenReturn({ deployFunction: deployFunc });
  td.when(deployFunc(td.matchers.anything(), td.matchers.anything(), td.matchers.anything())).thenResolve({});


  group.test('if templateName is empty then return status 400', function (t) {
    t.plan(1);

    funcToTest.invokeHttpTrigger({
      reqBody: {
        "templateName": ""
      }
    }).then(context => {
      t.equal(context.res.status, 400);
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
      t.equal(context.res.status, 400);
    }).catch(err => {
      t.fail(`something went wrong: ${err}`);
    });
  });

  group.test('if scheudle is empty return 400.', function (t) {
    t.plan(1);

    funcToTest.invokeHttpTrigger({
      reqBody: {
        "templateName": "sample",
        "schedule": ""
      }
    }).then(context => {
      t.equal(context.res.status, 400);
    }).catch(err => {
      t.fail(`something went wrong: ${err}`);
    });
  });

  group.test('if scheudle is empty return 400.', function (t) {
    t.plan(1);

    funcToTest.invokeHttpTrigger({
      reqBody: {
        "templateName": "sample",
        "schedule": null
      }
    }).then(context => {
      t.equal(context.res.status, 400);
    }).catch(err => {
      t.fail(`something went wrong: ${err}`);
    });
  });

  group.test('if scheudle not valid cron string 400', function (t) {
    t.plan(1);

    funcToTest.invokeHttpTrigger({
      reqBody: {
        "templateName": "sample",
        "schedule": "this is not valid cron string"
      }
    }).then(context => {
      t.equal(context.res.status, 400);
    }).catch(err => {
      t.fail(`something went wrong: ${err}`);
    });
  });

  group.test('validate that deploy func is called correctly', function (t) {
    t.plan(2);

    funcToTest.invokeHttpTrigger({
      reqBody: {
        "templateName": "sample",
        "schedule": "0 */2 * * * *"
      }
    },
      {
        functorTemplate: 'module.exports = require("{{templateName}}")'
      }
    ).then(context => {
      t.isNotEqual(context.res.status, 400)
      td.verify(deployFunc(`sample`,
        `module.exports = require("./../template-sample")`,
        getBindingResult()
      ));
      t.equal(context.res.status, 202);
    }).catch(err => {
      t.fail(`something went wrong: ${err}`);
    });
  });

  group.test('can pass configuration to function', function (t) {
    t.plan(2);

    const config = {
      "key1": "value1",
      "key2": 3
    };

    funcToTest.invokeHttpTrigger({
      reqBody: {
        "templateName": "sample",
        "schedule": "0 */2 * * * *",
        "config": config
      }
    },
      {
        functorTemplate: getCofigTemplate()
      }
    ).then(context => {
      t.isNotEqual(context.res.status, 400)
      td.verify(deployFunc(`sample`,
        getResult("./../template-sample", config),
        getBindingResult()
      )
      );
      t.equal(context.res.status, 202);
    }).catch(err => {
      t.fail(`something went wrong: ${err}`);
    });
  });

  group.test('no configuration does not fail', function (t) {
    t.plan(2);

    funcToTest.invokeHttpTrigger({
      reqBody: {
        "templateName": "sample",
        "schedule": "0 */2 * * * *"
      }
    },
      {
        functorTemplate: getCofigTemplate()
      }
    ).then(context => {
      t.isNotEqual(context.res.status, 400)
      td.verify(deployFunc(`sample`,
        getResult("./../template-sample", {}),
         getBindingResult()
      ));
      t.equal(context.res.status, 202);
    }).catch(err => {
      t.fail(`something went wrong: ${err}`);
    });
  });

  group.end();
});

function getCofigTemplate() {
  return `module.exports = function (context, myTimer) {
const functee = require("{{templateName}}");
functee(context, myTimer, {{{config}}});
};`
}

function getResult(templateName, config) {
  return `module.exports = function (context, myTimer) {
const functee = require("${templateName}");
functee(context, myTimer, ${JSON.stringify(config)});
};`
}

function getBindingResult() {
  return [
    {
      "name": "sample",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 */2 * * * *"
    }
  ];
}