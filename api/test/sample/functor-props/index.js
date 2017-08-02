module.exports = function (context, myTimer) {
  const functee = require("./../template-passdata");
  functee(context, myTimer, {value: 'props to you'});
};