var bodyParser = require('body-parser');
var Movie = require('../models/movie');
var User = require('../models/user');
var _ = require('underscore');

module.exports = function(app) {

  // pre handle user
  app.use(function(req, res, next) {
    var _user = req.session.user;

    if(_user) {
      app.locals.user = _user;
    }
      return next();
  })

  // index page
  app.get('/', function(req, res, next) {
    console.log('user in session: ');
    console.log(req.session.user);

    Movie.fetch(function(err, movies){
      if(err) {
        console.log(err);
      }

      res.render('index', {
        title: 'kv 首页',
        movies: movies
      });
    });
  });

  // signup
  app.post('/user/signup', function(req, res){
    var _user = req.body;
    // res.send(req.body + ':' + req.param('name'));
    console.log(req.body);

    User.find({name: _user.name}, function(err, user) {
      if (err) {
        console.log(err);
      }

      if(user.length) {
        // return res.redirect('/');
        res.send('用户名已被占用');
      }else{
        var user = new User(_user);
        user.save(function(err, user) {
          if(err){
            console.log(err)
          }
          
          res.redirect('/')  //页面跳转
        })
      }

    })
    
  })

  // signin
  app.post('/user/signin', function(req, res) {
    var _user = req.body;
    console.log("_user:");
    console.log(_user);
    // console.log(req);
    // res.send('_user');
    var name = _user.name;
    var password = _user.password;

    User.findOne({name: name}, function(err, user) {
      if (err) {
        console.log(err)
      }

      if(user.length){
        return res.redirect('/');
      }

      user.comparePassword(password, function(err, isMatch) {
        if(err){
          console.log(err);
        }

        if(isMatch) {
          // console.log('password is matched :' + user);
          req.session.user = user;
          return res.redirect('/');
        }

        else {
          console.log('password is not matched')
        }


      })
    })

  })

  //logout
  app.get('/logout', function(req, res) {
    delete req.session.user;
    delete app.locals.user;

    res.redirect('/');
  })

  // userlist page
  app.get('/admin/userlist', function(req, res) {
    User.fetch(function(err, user){
      if(err) {
        console.log(err);
      }

      res.render('userlist', {
        title: 'kv 用户列表页',
        user: user
      });
      // res.send(user);
    });
  }); 

  // detail page
  app.get('/movie/:id', function(req, res) {
    var id = req.params.id;
    Movie.findById(id, function(err, movie){
      if(err) {
        console.log(err);
      }
      res.render('detail', {
        title: movie.title,
        movies: movie
      });
      // res.send(movie + movie.title);
    })
  });

  // admin page
  app.get('/admin/movie', function(req, res) {
    res.render('admin', {
      title: 'kv 后台录入页',
      movie: {
        title: '',
        director: '',
        country: '',
        year: '',
        poster: '',
        flash: '',
        summary: '',
        language: ''
      }
    })
  });

  // admin update movie
  app.get('/admin/update/:id', function(req, res) {
    var id = req.params.id;

    if(id) {
      Movie.findById(id, function(err, movie) {
        res.render('admin', {
          title: 'kv 后台更新页',
          movie:movie
        })
      })
    }
  })

  // admin post movie
  app.post('/admin/movie/new', function(req, res) {
    var id = req.body.id;
    var movieObj = {
      _id: id,
      title:req.body.title,
      director:req.body.director,
      country:req.body.country,
      language:req.body.language,
      year:req.body.year,
      summary:req.body.summary,
      poster:req.body.poster,
      flash:req.body.flash
    };
    var _movie;
    // res.send(movieObj);

    if(id !== 'undefined') {
      Movie.findById(id, function(err, movie){
        if(err){
          console.log(err);
        }

        _movie = _.extend(movie, movieObj);
        _movie.save(function(err, movie) {
          if(err) {
            console.log(err);
          }
          res.redirect('/movie/' + movie._id);
        })
      })
    }else {
      _movie = new Movie({
        director: movieObj.director,
        title: movieObj.title,
        country: movieObj.country,
        language: movieObj.language,
        year: movieObj.year,
        poster: movieObj.poster,
        summary: movieObj.summary,
        flash: movieObj.flash
      });

      _movie.save(function(err, movie) {
        if(err) {
          console.log(err)
        }

        res.redirect('/movie/' + movie.id)
      })
    }
  })

  // list page
  app.get('/admin/list', function(req, res) {
    Movie.fetch(function(err, movies){
      if(err) {
        console.log(err);
      }

      res.render('list', {
        title: 'kv 列表页',
        movies: movies
      });
    });
  });

  // list delete movie
  app.delete('/admin/list', function(req, res) {
    var id = req.query.id;
    console.log(req.query);
    // res.send('id:'+id);

    if(id) {
      Movie.remove({_id: id}, function(err, movie) {
        if(err) {
          console.log(err);
        }
        else {
          res.json({success: 1});
        }
      })
    }
  })
  
}
