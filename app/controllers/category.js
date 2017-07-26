var Category = require('../models/category');
var Comment = require('../models/comment');
var _ = require('underscore');

// category_admin new page
exports.new = function(req, res) {
  res.render('category_admin', {
    title: 'kv 后台录入页',
    category: {}
  })
};

// admin post movie
exports.save = function(req, res) {
  var _category = {
    name:req.body.name
  };
  // res.send(movieObj);

  var category = new Category(_category);

  category.save(function(err, category) {
    if(err) {
      console.log(err)
    }

    console.log('ok');
    res.redirect('/admin/category/list')
  })

};

// catelist page
exports.list = function(req, res) {
  Category.fetch(function(err, categories){
    if(err) {
      console.log(err);
    }

    res.render('categorylist', {
      title: 'kv 电影分类列表页',
      categories: categories
    });
    // res.send(categories);
  });
};
