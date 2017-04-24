/**
 * Created by sksms on 2017-04-25.
 */


var mysql = require('mysql');
//db 접속
var conn = mysql.createConnection({
    host :'localhost',
    user :'root',
    password :'111111',
    database :'o2'
});

//DB에 접속하기
conn.connect();

var sql = 'delete from topic where id=?';
var params =[1];
conn.query(sql, params ,function(err, rows, fields){
    if (err){
        console.log(err);
    }else{
        console.log(rows);
    }
})








//변수를 넣어서 정적인것말고 동적으로 만든다
/*
var sql = 'insert into topic (title, description, author) values(?,?,?)';
var params = ['supervisor', 'watcher', 'grapthittie'];
conn.query(sql, params, function(err ,rows, fields){
    if(err){
        console.log(err);
    }else{
        console.log(rows.insertId);
    }
});
*/







/* 디비에 값을 넘겨서 저장하는것!! 이부분 좀 중요할듯
var sql = 'insert into topic (title, description, author) values("express", "server-sidejavascript", "seongmin")';
conn.query(sql, function(err, rows, fields){
    if(err){
        console.log(err);
    }else{
        console.log(rows.insertId);
    }

});
*/

//쿼리를 넘기는 방법 밑 콜백 함수에 대한것
/*conn.query(sql, function(err, rows, fields){
    if(err){
        console.log(err);
    }else{
        for(var i=0; i<rows.length; i++){
        //로우 열에 대한 내용을 담아옴
            console.log(rows[i].title);
        }
    }
}); */

conn.end();