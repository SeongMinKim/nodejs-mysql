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


//test 부분
app.get('/',function(req,res){
    res.send('hello');
})


//page 수정 기능
app.get('/topic/:id/edit', function(req, res){
    var sql = 'select id, title from topic';
    conn.query(sql, function(err, topics, fields){
      var id = req.params.id;
      if(id) {
          var sql = 'select * from topic where id=?';
          conn.query(sql,[id], function(err, topic, fields){
              if (err) {
                  console.log(err);
                  res.status(500).send('Internal Serever Error');
              } else {
                  res.render('edit', {topics: topics, topic: topic[0]});
              }
          });
      }else{
          console.log('There is no id');
          res.status(500).send('Internal Server Error');
      }
    });
})


//수정하는것 post로 넘겨받기
app.post(['/topic/:id/edit'], function(req, res){
    var title = req.body.title;
    var description= req.body.description;
    var author =req.body.author;
    var id = req.params.id;
    var sql = 'update topic set title=?, description=?, author=? where id=?'
    conn.query(sql,[title, description, author ,id], function(err , result, fields){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }else{
            res.redirect('/topic/'+id)
        }
    });
});



// 글 뿌려주기
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



//글 추가 부분
app.post('/topic/add', function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var sql = 'insert into topic (title,description, author) values(?,?,?)';
    //fs.writeFile('data/'+title, description, function(err){
    conn.query(sql, [title, description,author],function(err, result, fields){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        }else{
            res.redirect('/topic/'+result.insertId);
        }
    });
    //});
})

//삭제 하는 부분
app.get('/topic/:id/delete',function(req, res) {
    var sql = 'select id,title from topic';
    var id = req.params.id;
    conn.query(sql, function (err, topics, fields) {
        var sql = 'select * from topic where id=?';
        conn.query(sql, [id], function (err, topic) {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else {
                if(topic.length===0){
                    console.log('there is no values');
                    res.status(500).send('Internal Server Error');
                }else{
                    res.render('delete',{topics:topics, topic:topic[0]});
                }
            }

        });
    });
});

//delete 부분 한번더 묻는거 받기
app.post('/topic/:id/delete', function(req,res){
    var id = req.params.id;
    var sql = 'delete from topic where id=?';
    conn.query(sql,[id],function(err, result){
        res.redirect('/topic/');
    });
});


app.listen(5000, function(){
    console.log('Connected, 5000 port!');
})
