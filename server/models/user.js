'use strict';
const bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Todo);
      }
    },
    instanceMethods: {
      comparePassword: function(candidatePassword, callback) {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
          if (err) { return callback(err); }

          callback(null, isMatch);
        });
      }
    },
    hooks: {
      beforeCreate: function(user, options, next) {
        // generate a salt then run callback
        bcrypt.genSalt(10, function(err, salt) {
          if (err) { return next(err); }

          // hash (encrypt) our password using the salt
          bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) { return next(err); }

            // overwrite plain text password with encrypted password
            user.password = hash;
            return next(null);
          });
        });
      }
    }
  });
  return User;
};
