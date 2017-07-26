var Movie = require('../models/movie');
var Category = require('../models/category');
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
      .populate('reply.from reply.to', 'name')
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
  Category.find({}, function(err, categories) {
    res.render('admin', {
      title: 'kv 后台录入页',
      categories: categories,
      movie: {}
    })    
  })
};

// admin update movie
exports.update = function(req, res) {
  var id = req.params.id;

  if(id) {
    Movie.findById(id, function(err, movie) {
      Category.find({}, function(err, categories) {
        console.log('movie:');
        console.log(movie);
        res.render('admin', {
          title: 'kv 后台更新页',
          movie:movie,
          categories: categories
        })
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
    category: req.body.cateName,
    summary:req.body.summary,
    poster:req.body.poster,
    flash:req.body.flash
  };
  console.log('movie.save:');
  console.log(req.body);
  console.log('id:');
  console.log(id);
  console.log(!!id);
  var _movie;
  // res.send(movieObj);

  if(!!id) {
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
    _movie = new Movie(movieObj);

    var categoryId = _movie.category;

    _movie.save(function(err, movie) {
      if(err) {
        console.log(err)
      }

      Category.findById(categoryId, function(err, category) {
        category.movies.push(movie._id);

        category.save(function(err, category) {          
          res.redirect('/movie/' + movie.id)
        })
      })
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