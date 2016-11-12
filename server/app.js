var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var index = require('./routes/index');
var math = require('./routes/math');

app.use(bodyParser.urlencoded({ extended: true }));

//routes
app.use('/math', math);

//Static Files
app.use('/', index);

// Set port to listen on
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
  console.log('server is listening on port ' + app.get('port'));
});
