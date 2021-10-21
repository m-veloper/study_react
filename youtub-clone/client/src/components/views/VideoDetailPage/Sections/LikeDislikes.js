import React, {useEffect, useState} from 'react'
import {Tooltip, Icon} from 'antd';
import Axios from 'axios';

function LikeDislikes(props) {
  console.log(props);

  const [Likes, setLikes] = useState(0)
  const [Dislikes, setDislikes] = useState(0)
  const [LikeAction, setLikeAction] = useState(null)
  const [DislikeAction, setDislikeAction] = useState(null)
  let variable = {};

  if (props.video) {
    variable = {videoId: props.videoId, userId: props.userId}
  } else {
    variable = {commentId: props.commentId, userId: props.userId}
  }


  useEffect(() => {

    // 현재 좋아요 하고 있는 정보
    Axios.post('/api/like/getLikes', variable)
      .then(response => {
        console.log('getLikes', response.data)

        if (response.data.success) {

          // 비디오나 코멘트에서 얼마나 많은 좋아요 정보가 있는지.
          setLikes(response.data.likes.length)

          // 내가 이미 좋아요를 눌렀는지.
          response.data.likes.map(like => {
            if (like.userId === props.userId) {
              setLikeAction('liked')
            }
          })
        } else {
          alert('Failed to get likes')
        }
      })

    // 싫어요 정보 가져오기
    Axios.post('/api/like/getDislikes', variable)
      .then(response => {
        console.log('getDislike', response.data)
        if (response.data.success) {
          // 비디오나 코멘트에서 얼마나 많은 싫어요 정보가 있는지.
          setDislikes(response.data.dislikes.length)

          // 내가 이미 싫어요 눌렀는지.
          response.data.dislikes.map(dislike => {
            if (dislike.userId === props.userId) {
              setDislikeAction('disliked')
            }
          })
        } else {
          alert('Failed to get dislikes')
        }
      })

  }, [])


  /**
   * 좋아요를 클릭 할 때
   */
  const onLike = () => {

    if (LikeAction === null) {

      // 좋아요 저장
      Axios.post('/api/like/upLike', variable)
        .then(response => {
          if (response.data.success) {

            setLikes(Likes + 1)
            setLikeAction('liked')

            //If dislike button is already clicked
            if (DislikeAction !== null) {
              setDislikeAction(null)
              setDislikes(Dislikes - 1)
            }
          } else {
            alert('Failed to increase the like')
          }
        })

    } else {

      // 좋아요 삭제
      Axios.post('/api/like/unLike', variable)
        .then(response => {
          if (response.data.success) {

            setLikes(Likes - 1)
            setLikeAction(null)

          } else {
            alert('Failed to decrease the like')
          }
        })
    }
  }

  /**
   * 싫어요를 클릭 할 때
   */
  const onDisLike = () => {

    if (DislikeAction !== null) {

      // 싫어요 삭제
      Axios.post('/api/like/unDisLike', variable)
        .then(response => {
          if (response.data.success) {

            setDislikes(Dislikes - 1)
            setDislikeAction(null)

          } else {
            alert('Failed to decrease dislike')
          }
        })

    } else {

      // 싫어요 저장
      Axios.post('/api/like/upDisLike', variable)
        .then(response => {
          if (response.data.success) {

            setDislikes(Dislikes + 1)
            setDislikeAction('disliked')

            //If dislike button is already clicked
            if (LikeAction !== null) {
              setLikeAction(null)
              setLikes(Likes - 1)
            }

          } else {
            alert('Failed to increase dislike')
          }
        });
    }
  }

  return (
    <React.Fragment>
      <span key="comment-basic-like">
        <Tooltip title="Like">
          <Icon type="like"
                theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                onClick={onLike}/>
        </Tooltip>
        <span style={{paddingLeft: '8px', cursor: 'auto'}}>{Likes}</span>
      </span>&nbsp;&nbsp;
      <span key="comment-basic-dislike">
        <Tooltip title="Dislike">
          <Icon
            type="dislike"
            theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
            onClick={onDisLike}
          />
        </Tooltip>
        <span style={{paddingLeft: '8px', cursor: 'auto'}}>{Dislikes}</span>
      </span>
    </React.Fragment>
  )
}

export default LikeDislikes
