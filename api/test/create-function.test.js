var test = require('tape');
var td = require('testdouble');

var funcHarness = require('azure-functions-node-harness');
var helpers = td.replace('../functions/helpers/index.js');

test('Create functions Tests', function (group) {
  var funcToTest = funcHarness('CreateFunction', { dirname: "functions" });

  const deployFunc = td.function();
  td.when(helpers.functionFactory()).thenReturn({ deployFunction: deployFunc });
  td.when(deployFunc(td.matchers.anything(), td.matchers.anything(), td.matchers.anything())).thenResolve({});

  group.test('if req body is empty then return status 400', function (t) {
    t.plan(2);

    funcToTest.invokeHttpTrigger({
      reqBody: null
    }).then(context => {
      t.equal(context.res.status, 400);
      t.equal(context.res.body, "must pass body");
    }).catch(err => {
      t.fail(`something went wrong: ${err}`);
    });
  });

  group.test('if funcName is empty then return status 400', function (t) {
    t.plan(2);

    funcToTest.invokeHttpTrigger({
      reqBody: reqBody({
        "funcName": ""
      })
    }).then(context => {
      t.equal(context.res.status, 400);
      t.equal(context.res.body, "must pass funcName");
    }).catch(err => {
      t.fail(`something went wrong: ${err}`);
    });
  });

  group.test('if funcName is null then return status 400', function (t) {
    t.plan(2);

    funcToTest.invokeHttpTrigger({
      reqBody: reqBody({
        "funcName": null
      })
    }).then(context => {
      t.equal(context.res.status, 400);
      t.equal(context.res.body, "must pass funcName");
    }).catch(err => {
      t.fail(`something went wrong: ${err}`);
    });
  });

  group.test('if templateName is empty then return status 400', function (t) {
    t.plan(2);

    funcToTest.invokeHttpTrigger({
      reqBody: reqBody({
        "templateName": ""
      })
    }).then(context => {
      t.equal(context.res.status, 400);
      t.equal(context.res.body, "must pass templateName");
    }).catch(err => {
      t.fail(`something went wrong: ${err}`);
    });
  });

  group.test('if templateName is null then return status 400', function (t) {
    t.plan(2);

    funcToTest.invokeHttpTrigger({
      reqBody: reqBody({"templateName": null })
    }).then(context => {
      t.equal(context.res.status, 400);
      t.equal(context.res.body, "must pass templateName");
    }).catch(err => {
      t.fail(`something went wrong: ${err}`);
    });
  });

  group.test('if scheudle is empty return 400.', function (t) {
    t.plan(2);

    funcToTest.invokeHttpTrigger({
      reqBody: reqBody({"schedule": ""})
    }).then(context => {
      t.equal(context.res.status, 400);
      t.equal(context.res.body, "must pass schedule");
    }).catch(err => {
      t.fail(`something went wrong: ${err}`);
    });
  });

  group.test('if scheudle is null return 400.', function (t) {
    t.plan(2);

    funcToTest.invokeHttpTrigger({
      reqBody: reqBody({"schedule": null })
    }).then(context => {
      t.equal(context.res.status, 400);
      t.equal(context.res.body, "must pass schedule");
    }).catch(err => {
      t.fail(`something went wrong: ${err}`);
    });
  });

  group.test('if scheudle not valid cron string 400', function (t) {
    t.plan(2);

    funcToTest.invokeHttpTrigger({
      reqBody: reqBody({
        "schedule": "this is not valid cron string"
      })
    }).then(context => {
      t.equal(context.res.status, 400);
      t.equal(context.res.body, "must be valid cron schedule");
    }).catch(err => {
      t.fail(`something went wrong: ${err}`);
    });
  });

  group.test('validate that deploy func is called correctly', function (t) {
    t.plan(2);

    funcToTest.invokeHttpTrigger({
      reqBody: reqBody()
    },
      {
        functorTemplate: 'module.exports = require("{{templateName}}")'
      }
    ).then(context => {
      t.isNotEqual(context.res.status, 400)
      td.verify(deployFunc(reqBody().funcName,
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
      reqBody: reqBody({"config": config})
    },
      {
        functorTemplate: getCofigTemplate()
      }
    ).then(context => {
      t.isNotEqual(context.res.status, 400)
      td.verify(deployFunc(`name`,
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
      reqBody: reqBody()
    },
      {
        functorTemplate: getCofigTemplate()
      }
    ).then(context => {
      t.isNotEqual(context.res.status, 400)
      td.verify(deployFunc(`name`,
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
      "name": "name",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 */2 * * * *"
    }
  ];
}

const reqBody = params => {
  const valid = {
    "templateName": "template-sample",
    "schedule": "0 */2 * * * *",
    "funcName": "name"
  }

  return Object.assign({}, valid, params)
}