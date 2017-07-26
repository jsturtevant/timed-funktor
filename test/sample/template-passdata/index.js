module.exports = function (context, myTimer, props) {
  var timeStamp = new Date().toISOString();
  
  if(myTimer.isPastDue)
  {
    context.log('JavaScript is running late!');
  }
  context.log(`Funky funktor with props! '${props.value}'`, timeStamp);   
  
  context.done();
};