const express = require('express')
const app = express()
const port = 5000

// 개발 환경에 따라 DB 연결 설정
const config = require("./config/key");
//DB 연결
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const {User} = require("./models/User");
const {auth} = require("./middleware/auth");


mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("몽고디비 연결 완료"))
  .catch(err => console.log(err));

//application/x-www-form-urlencoded 형태를 분석 후 가져오는 역할
app.use(bodyParser.urlencoded({extended: true}))
//application/json 형태를 분석 후 가져오는 역할
app.use(bodyParser.json());
app.use(cookieParser());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/', (req, res) => {
  res.send("<h1>서버 연결</h1>");
})

app.get('/api/hello', (req, res) => {
  res.send("axios test 성공");
})

/**
 * 등록 라우터
 */
app.post('/register', (req, res) => {
  // 회원가입할 떄 필요한 정보들을 client에서 가져오면 DB에 넣어준다.
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) {
      return res.json({success: false, err})
    } else {
      return res.status(200).json({success: true})
    }
  });
});

/**
 * 로그인 라우터
 */
app.post('/login', (req, res) => {
  // 요청된 이메을 DB에서 찾기
  User.findOne({email: req.body.email}, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "가입된 유저가 없습니다."
      })
    } else {
      // 요청된 이메일이 DB에 있다면 비밀번호 체크
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch) {
          return res.json({
            loginSuccess: false,
            message: "비밀번호가 정확하지 않습니다. 다시 확인해주세요."
          });
        } else {
          // 비밀번호가 일치한다면 유저 전용 토큰 생성
          user.generateToken((err, user) => {
            if (err) {
              return res.status(400).send(err);
            } else {
              // 토큰 저장. 어디에? > 쿠키, 로컬스토리지, 세션?
              res.cookie("x_auth", user.token)
                // .status(200)
                .json({
                  loginSuccess: true,
                  userId: user._id
                });
            }
          });
        }
      });
    }
  });
});

/**
 * 토큰 인증하기
 */
app.get('/api/users/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user.id,
    isAdmin: req.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastName: req.user.lastName,
    role: req.user.role,
    image: req.user.image
  })
});

/**
 * 로그아웃
 */
app.get('/api/users/logout', auth, (req, res) => {
  User.findByIdAndUpdate({_id: req.user._id}, {token: ""}, (err, user) => {
    if (err) {
      return res.json({success: false, err})
    } else {
      return res.status(200).send({
        success: true
      });
    }
  });
});

