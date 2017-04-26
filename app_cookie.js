//쿠키
var express = require('express');
var cookieParser = require('cookie-parser')
var app = express();

app.use(cookieParser());


app.get('/count', function(req,res){
   res.cookie('count',1);
   res.send('count : ');
});








app.listen(3000, function(){
    console.log('Connect 3000');
})