var express = require('express');
var app = express();
// app.use(express.static(__dirname + '/'));
app.use(express.static('/app/', {index: 'index.html'}));
app.listen(process.env.PORT || 8888);