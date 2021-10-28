const express = require('express');
const router = express.Router();
const {Favorite} = require('../models/Favorite');

/**
 * mongoDB에서 favorite 숫자를 가져오기
 */
router.post('/favoriteNumber', (req, res) => {

  //mongoDB에서   favorite 숫자를 가져오기
  Favorite.find({"movieId": req.body.movieId})
    .exec((err, info) => {
      if (err) {
        return res.status(400).send(err)
      } else {
        // 그다음에   프론트에  다시   숫자 정보를 보내주기
        return res.status(200).json({success: true, favoriteNumber: info.length})
      }
    })
})

/**
 * Favorite 리스트에 넣었는지 정보를 DB 에서 가져오기
 */
router.post('/favorited', (req, res) => {

  // 내가 이 영화를  Favorite 리스트에 넣었는지   정보를  DB 에서 가져오기
  Favorite.find({"movieId": req.body.movieId, "userFrom": req.body.userFrom})
    .exec((err, info) => {
      if (err) {
        return res.status(400).send(err)
      } else {
        // 그다음에   프론트에  다시   숫자 정보를 보내주기
        let result = false;
        if (info.length !== 0) {
          result = true
          return res.status(200).json({success: true, favorited: result})
        }
      }
    })
})

/**
 * 즐겨찾기 삭제
 */
router.post('/removeFromFavorite', (req, res) => {

  Favorite.findOneAndDelete({movieId: req.body.movieId, userFrom: req.body.userFrom})
    .exec((err, doc) => {
      if (err) {
        return res.status(400).send(err)
      } else {
        return res.status(200).json({success: true, doc})
      }
    })
})

/**
 * 즐겨찾기 추가
 */
router.post('/addToFavorite', (req, res) => {

  const favorite = new Favorite(req.body)

  favorite.save((err, doc) => {
    if (err) {
      return res.status(400).send(err)
    } else {
      return res.status(200).json({success: true})
    }
  })
})

/**
 * 즐겨찾기한 영화 목록 출력
 */
router.post('/getFavoredMovie', (req, res) => {

  Favorite.find({'userFrom': req.body.userFrom})
    .exec((err, favorites) => {
      if (err) {
        return res.status(400).send(err)
      } else {
        return res.status(200).json({success: true, favorites})
      }
    })
})

/**
 * 즐겨찾기한 특정 영화 삭제
 */
router.post('/removeFromFavorite', (req, res) => {

  Favorite.findOneAndDelete({movieId: req.body.movieId, userFrom: req.body.userFrom})
    .exec((err, result) => {
      if (err) {
        return res.status(400).send(err)
      } else {
        return res.status(200).json({success: true})
      }
    })
})


module.exports = router;
