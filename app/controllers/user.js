var bodyParser = require('body-parser');
var User = require('../models/user');

// signup
exports.signup = function(req, res){
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
  
};

// signin
exports.signin = function(req, res) {
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

}

//logout
exports.logout = function(req, res) {
  // delete req.session.user;
  // delete app.locals.user;

  res.redirect('/');
}

// userlist page
exports.list = function(req, res) {
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
}; 