/**
 * Created by sksms on 2017-04-25.
 */
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var _storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
var upload = multer({ storage: _storage })
var fs = require('fs');
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

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.locals.pretty = true;
app.use('/user', express.static('uploads'));
app.set('views', './views_mysql');
app.set('view engine', 'jade');
app.get('/upload', function(req, res){
    res.render('upload');
});
app.post('/upload', upload.single('userfile'), function(req, res){
    res.send('Uploaded : '+req.file.filename);
});
app.get('/topic/add', function(req, res){
    var sql = 'select id, title from topic';
    conn.query(sql, function(err, topics, fields){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }else {
            res.render('add', {topics: topics});
        }
    });
    // fs.readdir('data', function(err, files){
    //     if(err){
    //         console.log(err);
    //         res.status(500).send('Internal Server Error');
    //     }
    //     res.render('add', {topics:files});
    // });
});


app.get(['/topic', '/topic/:id'], function(req, res){
    var sql = 'select * from topic';
    conn.query(sql, function(err, topics, fields){
        var id = req.params.id;
        if (id){
            var sql = 'select * from topic where id=?';
            conn.query(sql, [id], function(err, topic, fields){
                if(err){
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.render('view',{topics:topics, topic:topic[0]})
                }
            });

        }else {
            res.render('view', {topics: topics});
        }
    });
    //저장되어있는 파일을 목록으로 만들어 주기 이부분을 DB로
    /*
    fs.readdir('data', function(err, files){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        var id = req.params.id;
        if(id){
            // id값이 있을 때
            fs.readFile('data/'+id, 'utf8', function(err, data){
                if(err){
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                }
                res.render('view', {topics:files, title:id, description:data});
            })
        } else {
            // id 값이 없을 때
            res.render('view', {topics:files, title:'Welcome', description:'Hello, JavaScript for server.'});
        }
    })
    */
});

app.post('/topic', function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    fs.writeFile('data/'+title, description, function(err){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.redirect('/topic/'+title);
    });
})
app.listen(5000, function(){
    console.log('Connected, 5000 port!');
})
