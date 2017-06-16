var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CommentSchema = new Schema({
  movie: {type: ObjectId, ref: 'Movie'},
  from: {type: ObjectId, ref: 'User'},
  to: {type: ObjectId, ref: 'User'},
  content: String,
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

CommentSchema.pre('save', function(next) {
  if(this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  }else{
    this.meta.updateAt = Date.now();
  }
  next();
})

CommentSchema.statics = {
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

module.exports = CommentSchema