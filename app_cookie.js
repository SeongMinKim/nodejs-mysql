//쿠키
var express = require('express');
var cookieParser = require('cookie-parser')
var app = express();

app.use(cookieParser());


var products={
    1:{title: ' The history of web1'},
    2:{title: ' The next Web'}
};


app.get('/products', function(req,res){
    for(var name in products){
        console.log(products[name]);
    }
    res.send('Products');
})






//쿠키 카운팅
app.get('/count', function(req,res){
    if(req.cookies.count){ //쿠키가 있다면
        var count = parseInt(req.cookies.count)
        //변수로하고 parseInt:자바스크립트 내장함수로 어떠한 값을 정수로 바꿔주는 역할
    }else{//없다면
        var count = 0; //초기화를 해준다.
    }
   count = count +1; //카운터 값이 1씩 증가
   res.cookie('count', count);
   res.send('count : '+req.cookies.count);
});








app.listen(3000, function(){
    console.log('Connect 3000');
})