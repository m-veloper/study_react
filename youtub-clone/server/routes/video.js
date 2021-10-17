// const express = require('express');
// const router = express.Router();
// // const { Video } = require("../models/Video");
// // const {auth} = require("../middleware/auth");
// const multer = require("multer");
// const path = require("path");
//
// //=================================
// //             video
// //=================================
//
// let storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   },
//   fileFilter: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     if (ext !== ".mp4") {
//       // 다른 파일도 허용하고 싶다면 if (ext !== ".mp4" || ext !== ".png" ) 이런식으로 추가
//       return cb(res.state(400).end("m4 파일만 허용됩니다."), false);
//     } else {
//       cb(null, true);
//     }
//   }
// });
// // 한개의 파일만
// const upload = multer({storage: storage}).single("file");
//
// router.post("/uploadfiles ", (req, res) => {
//   // 비디오를 서버에 저장
//   upload(req, res, err => {
//     if (err) {
//       return res.json({success: false, err})
//     } else {
//       return res.json({success: true, url: req.req.file.path, fileName: req.req.file.fileName});
//     }
//   })
// });
//
// module.exports = router;
