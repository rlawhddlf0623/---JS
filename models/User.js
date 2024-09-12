const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  pw: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 비밀번호 해시화 미들웨어
userSchema.pre("save", function (next) {
  if (this.isModified("pw") || this.isNew) {
    bcrypt.hash(this.pw, 10, (err, hashedPw) => {
      if (err) return next(err);
      this.pw = hashedPw;
      next();
    });
  } else {
    return next();
  }
});

const User = mongoose.model("Users", userSchema);
module.exports = User;
