var Movie = require('../models/movie');

// index page
exports.index = function(req, res) {
  console.log('user in session: ');
  console.log(req.session.user);
  // console.log('user: ');
  // console.log(user);

  Movie.fetch(function(err, movies){
    if(err) {
      console.log(err);
    }

    res.render('index', {
      title: 'kv 首页',
      movies: movies
    });
  });
};