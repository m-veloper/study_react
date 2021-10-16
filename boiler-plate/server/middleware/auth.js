const {User} = require("../models/User");

/**
 * 토큰 인증 처리
 * @param req
 * @param res
 * @param next
 */
let auth = (req, res, next) => {
  // 인증처리
  // 클라이언트 쿠키에서 토큰 가져오기.
  let token = req.cookies.x_auth;
  // 토큰 복호화 후 유저 찾기
  User.findByToken(token, (err, user) => {
    if (err) {
      throw err
    } else if (!user) {
      return res.json({isAuth: false, error: true})
    } else {
      req.token = token;
      req.user = user;
      next();
    }
  });
}
module.exports = {auth};

