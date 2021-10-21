const express = require('express');
const router = express.Router();
const {Like} = require("../models/Like");
const {Dislike} = require("../models/Dislike");

const {auth} = require("../middleware/auth");

//=================================
//             Likes DisLikes
//=================================

/**
 * 좋아요한 정보 가져오기
 */
router.post("/getLikes", (req, res) => {

  let variable = {}
  if (req.body.videoId) {
    variable = {videoId: req.body.videoId}
  } else {
    variable = {commentId: req.body.commentId}
  }

  Like.find(variable)
    .exec((err, likes) => {
      if (err) {
        return res.status(400).send(err);
      } else {
        return res.status(200).json({success: true, likes})
      }
    })


})

/**
 * 싫어요 정보 가져오기
 */
router.post("/getDislikes", (req, res) => {

  let variable = {}
  if (req.body.videoId) {
    variable = {videoId: req.body.videoId}
  } else {
    variable = {commentId: req.body.commentId}
  }

  Dislike.find(variable)
    .exec((err, dislikes) => {
      if (err) {
        return res.status(400).send(err);
      } else {
        return res.status(200).json({success: true, dislikes})
      }
    })

})


/**
 * 좋아요 저장
 */
router.post("/upLike", (req, res) => {

  let variable = {}
  if (req.body.videoId) {
    variable = {videoId: req.body.videoId, userId: req.body.userId}
  } else {
    variable = {commentId: req.body.commentId, userId: req.body.userId}
  }

  const like = new Like(variable)
  //save the like information data in MongoDB
  like.save((err, likeResult) => {
    if (err) {
      return res.json({success: false, err});
    } else {
      //In case disLike Button is already clicked, we need to decrease the dislike by 1
      Dislike.findOneAndDelete(variable)
        .exec((err, disLikeResult) => {
          if (err) {
            return res.status(400).json({success: false, err});
          } else {
            return res.status(200).json({success: true});
          }
        });
    }
  });
});

/**
 * 좋아요 삭제
 */
router.post("/unLike", (req, res) => {

  let variable = {}
  if (req.body.videoId) {
    variable = {videoId: req.body.videoId, userId: req.body.userId}
  } else {
    variable = {commentId: req.body.commentId, userId: req.body.userId}
  }

  Like.findOneAndDelete(variable)
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({success: false, err});
      } else {
        return res.status(200).json({success: true});
      }
    });
});

/**
 * 싫어요 삭제
 */
router.post("/unDisLike", (req, res) => {

  let variable = {}
  if (req.body.videoId) {
    variable = {videoId: req.body.videoId, userId: req.body.userId}
  } else {
    variable = {commentId: req.body.commentId, userId: req.body.userId}
  }

  Dislike.findOneAndDelete(variable)
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({success: false, err});
      } else {
        return res.status(200).json({success: true});
      }
    });
});

/**
 * 싫어요 저장
 */
router.post("/upDisLike", (req, res) => {

  let variable = {}
  if (req.body.videoId) {
    variable = {videoId: req.body.videoId, userId: req.body.userId}
  } else {
    variable = {commentId: req.body.commentId, userId: req.body.userId}
  }

  const disLike = new Dislike(variable)
  //save the like information data in MongoDB
  disLike.save((err, dislikeResult) => {
    if (err) {
      return res.json({success: false, err});
    } else {
      //In case Like Button is already clicked, we need to decrease the like by 1
      Like.findOneAndDelete(variable)
        .exec((err, likeResult) => {
          if (err) {
            return res.status(400).json({success: false, err});
          } else {
            return res.status(200).json({success: true})
          }
        })
    }
  })
})


module.exports = router;
