var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CategorySchema = new Schema({
  name: String,
  movies: [{type: ObjectId, ref: 'Movie'}],
  meta: {
    createAt: {
      type: Date,
      datault: Date.now()
    },
    updateAt: {
      type: Date,
      datault: Date.now()
    }
  }
})

CategorySchema.pre('save', function(next) {
  if(this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  }else{
    this.meta.updateAt = Date.now();
  }
  next();
})

CategorySchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  fetchById: function(id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

module.exports = CategorySchema