const express = require('express');
const router = express.Router();
// const { Video } = require("../models/Video");
// const {auth} = require("../middleware/auth");
const multer = require("multer");

//=================================
//             video
//=================================

/**
 * 파일을 저장할 위치, 파일명 설정
 * @type {DiskStorage}
 */
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

/**
 * 파일 필터링
 * @param req
 * @param file
 * @param cb
 */
const fileFilter = (req, file, cb) => {
  // mime type 체크하여 원하는 타입만 필터링
  const ext = file.mimetype;
  if (ext !== 'video/mp4') {
    // 다른 파일도 허용하고 싶다면 if (ext !== "video/mp4" || ext !== "application/pdf" )
    // 이런식으로 file.mimetype 확인하여 추가.
    cb({msg: 'mp4 파일만 업로드 가능합니다.'}, false);
  } else {
    cb(null, true);
  }
}

// 한개의 파일만
const upload = multer({storage: storage, fileFilter: fileFilter}).single("file");

router.post("/uploadfiles", (req, res) => {
  // 비디오를 서버에 저장
  upload(req, res, err => {
    if (err) {
      return res.json({success: false, err})
    } else {
      return res.json({success: true, url: req.file.path, fileName: req.file.filename});
    }
  })
});

module.exports = router;
