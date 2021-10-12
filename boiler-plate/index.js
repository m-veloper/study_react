const express = require('express')
const app = express()
const port = 5000

// 개발 환경에 따라 DB 연결 설정
const config = require("./config/key");
//DB 연결
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const {User} = require("./models/User");

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("몽고디비 연결 완료"))
  .catch(err => console.log(err));

//application/x-www-form-urlencoded 형태를 분석 후 가져오는 역할
app.use(bodyParser.urlencoded({extended: true}))
//application/json 형태를 분석 후 가져오는 역할
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})

// 등록 라우터
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

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
