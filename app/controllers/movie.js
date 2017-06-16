var bodyParser = require('body-parser');
var Movie = require('../models/movie');
var Comment = require('../models/comment');
var User = require('../models/user');
var _ = require('underscore');

// detail page
exports.detail = function(req, res) {
  var id = req.params.id;
  var user = req.session.user;
  Movie.findById(id, function(err, movie){
    if(err) {
      console.log(err);
    }
    Comment
      .find({movie: id})
      .populate('from', 'name')
      .exec(function(err, comments) {
        console.log('comments: ');
        console.log(comments);
        res.render('detail', {
          title: movie.title,
          movies: movie,
          comments: comments
        });      
      })
  })
};

// admin new page
exports.new = function(req, res) {
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
};

// admin update movie
exports.update = function(req, res) {
  var id = req.params.id;

  if(id) {
    Movie.findById(id, function(err, movie) {
      res.render('admin', {
        title: 'kv 后台更新页',
        movie:movie
      })
    })
  }
};

// admin post movie
exports.save = function(req, res) {
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
};

// list page
exports.list = function(req, res) {
  Movie.fetch(function(err, movies){
    if(err) {
      console.log(err);
    }

    res.render('list', {
      title: 'kv 列表页',
      movies: movies
    });
  });
};

// list delete movie
exports.del = function(req, res) {
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
};