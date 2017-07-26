module.exports = function (context, myTimer, props) {
  const functee = require("./../templates/passdata");
  functee(context, myTimer, {value: 'props to you'});
};