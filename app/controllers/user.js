var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var User = require('../models/user');

// signup
exports.showSignup = function(req, res) {
  res.render('signup', {
    title: '注册页面'
  });
}; 

exports.showSignin = function(req, res) {
  res.render('signin', {
    title: '登录页面'
  });
}; 

exports.signup = function(req, res){
  var _user = req.body;
  // res.send(req.body + ':' + req.param('name'));
  console.log(req.body);

  User.findOne({name: _user.name}, function(err, user) {
    if (err) {
      console.log(err);
    }

    if(user) {
      return res.redirect('/signin');
    }else{
      var user = new User(_user);
      console.log('user:');
      console.log(user);
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


    if(!user){
      return res.redirect('/signup');
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
        console.log('password is not matched');
        return res.redirect('/signin');        
      }


    })
  })

}

//logout
exports.logout = function(req, res) {
  delete req.session.user;
  // delete app.locals.user;

  res.redirect('/');
}

// userlist page
exports.list = function(req, res) {
  var _user = req.session.user;

  User.fetch(function(err, user){
    if(err) {
      console.log(err);
    }

    res.render('userlist', {
      title: 'kv 用户列表页',
      users: user,
      user: _user
    });
    // res.send(user);
  });
}; 

exports.detail = function(req, res) {
  var id = req.params.id;
  // res.send(id);
  User.findById(id, function(err, user){
    if(err) {
      console.log(err);
    }
    res.json(user);
    // res.render('detail', {
    //   title: user.title,
    //   movies: user
    // });
    // res.send(movie + movie.title);
  })
}

// midware for user
exports.signinRequired = function(req, res, next) {
  var user = req.session.user;
  
  if (!user) {
    return res.redirect('/signin');
  }

  next();
}; 

// midware for admin
exports.adminRequired = function(req, res, next) {
  var user = req.session.user;

  console.log('adminRequired_user.role: ');
  console.log(user.role);

  if (user.role <= 10) {
    return res.redirect('/signin');
  }

  next();
}; 