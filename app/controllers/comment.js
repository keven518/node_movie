var bodyParser = require('body-parser');
var Comment = require('../models/comment');
var User = require('../models/user');
var _ = require('underscore');

// comment
exports.save = function(req, res) {
  var _comment = {
    movie:req.body.movieId,
    from:req.body.userId,
    content:req.body.comment
  };
  console.log('_comment: ');
  console.log(_comment);
  // res.send(_comment);
  var movieId = _comment.movie;
  var comment = new Comment(_comment);

  comment.save(function(err, comment) {
    if (err) {
      console.log(err);
    }

    res.redirect('/movie/' + movieId);
  })  
};