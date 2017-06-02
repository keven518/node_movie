var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
	name: {
		unique: true,
		type: String
	},
	password: String,
	createAt: {
			type: Date,
			datault: Date.now()
		},
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

UserSchema.pre('save', function(next) {


	var user = this;
	
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}

	var hash = bcrypt.hashSync(this.password);
  this.password = hash;
  next();
})

UserSchema.methods = {
	comparePassword: function(_password, cb) {
		bcrypt.compare(_password, this.password, function(err, isMatch) {
			if (err) return cb(err);

			cb(null, isMatch);
		})
	}
}

UserSchema.statics = {
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

module.exports = UserSchema