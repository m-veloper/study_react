const express = require('express');
const router = express.Router();
const {Video} = require("../models/Video");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");

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

/**
 * 파일 업로드 라우터
 */
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

/**
 * 썸네일 생성 및 비디오 러닝타임 같은 정보 출력 라우터
 */
router.post("/thumbnails", (req, res) => {

  let thumbsFilePath = "";
  let fileDuration = "";

  // 비디오 정보 출력
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    console.dir(metadata);
    console.log(metadata.format.duration);

    fileDuration = metadata.format.duration;
  })

  // 썸네일 생성
  ffmpeg(req.body.url)
    .on('filenames', function (filenames) {
      console.log('Will generate ' + filenames.join(', '))
      thumbsFilePath = "uploads/thumbnails/" + filenames[0];
    })
    .on('end', function () {
      console.log('Screenshots taken');
      return res.json({success: true, thumbsFilePath: thumbsFilePath, fileDuration: fileDuration})
    })
    .screenshots({
      // Will take screens at 20%, 40%, 60% and 80% of the video
      count: 1,
      folder: 'uploads/thumbnails',
      size: '320x240',
      // %b input basename ( filename w/o extension )
      filename: 'thumbnails-%b.png'
    });
});

/**
 * 비디오 DB 저장
 */
router.post("/uploadVideo", (req, res) => {
  const video = new Video(req.body)
  video.save((err, doc) => {
    if (err) {
      return res.json({success: false, err});
    } else {
      return res.status(200).json({success: true});
    }
  })
});

module.exports = router;
