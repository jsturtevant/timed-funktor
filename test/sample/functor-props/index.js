module.exports = function (context, myTimer, props) {
  const functee = require("./../template-passdata");
  functee(context, myTimer, {value: 'props to you'});
};