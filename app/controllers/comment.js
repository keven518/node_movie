var Comment = require('../models/comment');

// comment
exports.save = function(req, res) {
  var _comment = {
    movie:req.body.movieId,
    from:req.body.userId,
    content:req.body.comment,
    tid: req.body.comment_tid,
    cid: req.body.comment_cid
  };
  // res.send(_comment);
  var movieId = _comment.movie;

  console.log('body: ');
  console.log(req.body);
  console.log('_comment: ');
  console.log(_comment);


  if (_comment.cid) {
    Comment.findById(_comment.cid, function(err, comment) {
      var reply = {
        from: _comment.from,
        to: _comment.tid,
        content: _comment.content
      }

      comment.reply.push(reply);

      comment.save(function(err, comment) {
        if (err) {
          console.log(err);
        }
        res.redirect('/movie/' + movieId);
      })
    })
  }

  else{
    
    var comment = new Comment(_comment);

    comment.save(function(err, comment) {
      if (err) {
        console.log(err);
      }

      res.redirect('/movie/' + movieId);
    })  

  }

};