const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');

/**
 * 유저 모델(스키마)생성
 * @type {*}
 */
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxLength: 50
  },
  email: {
    type: String,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    minLength: 5
  },
  lastName: {
    type: String,
    maxLength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  }
})


/**
 * 데이터가 저장되기 전에 데이터 암호화
 */
userSchema.pre("save", function (next) {
  let user = this;

  if (user.isModified("password")) {
    // 비밀번호가 변경이될 경우 암호화
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) {
        return next(err);
      } else {
        bcrypt.hash(user.password, salt, function (err, hash) {
          // Store hash in your password DB.
          if (err) {
            return next(err);
          } else {
            user.password = hash;
            next();
          }
        });
      }
    });
  } else {
    next();
  }
})

/**
 * 로그인시 비밀번호 체크
 * @param plainPassword
 * @param cb
 */
userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plainPassword : 평문 비밀번호
  // cb : 암호화된 비밀번호
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    } else {
      cb(null, isMatch);
    }
  });
}

/**
 * jsonwebtoken 생성
 * @param cb
 */
userSchema.methods.generateToken = function (cb) {
  let user = this;
  const token = jwt.sign(user._id.toHexString(), "secretToken");
  user.token = token;
  user.save(function (err, user) {
    if (err) {
      return cb(err);
    } else {
      cb(null, user);
    }
  });
}

/**
 * 토큰 decode
 * @param token
 * @param cb
 */
userSchema.statics.findByToken = function (token, cb) {
  let user = this;
  jwt.verify(token, "secretToken", function (err, decoded) {
    // 유저 아이디를 이용해서 유저 아이디를 찾음
    // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
    user.findOne({"_id": decoded, "token": token}, function (err, user) {
      if (err) {
        return cb(err);
      } else {
        cb(null, user);
      }
    });
  });
}

const User = mongoose.model('User', userSchema);
module.exports = {User};
