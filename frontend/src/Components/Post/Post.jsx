import { Avatar, Button, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import {
  MoreVert,
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  DeleteOutline,
 } from '@mui/icons-material'
import { Link } from 'react-router-dom';
import './Post.css';
import { useDispatch, useSelector } from 'react-redux';
import { likePost } from '../../Actions/Post';
import { useAlert } from 'react-alert';

const Post = ( {
 postId,
  caption,
  postImage,
  likes = [],
  comments = [],
  ownerImage,
  ownerName,
  ownerId,
  isDelete = false,
  isAccount = false,
} ) => {
  
  const [liked, setLiked] = React.useState( false );

  const { error, message } = useSelector(
    ( state ) => state.like )

  const dispatch = useDispatch();
  const alert = useAlert();


  const handleLike = () => {
    setLiked( !liked );
    dispatch( likePost( postId ) );
    
  }



  return (
    <div className="post">
      <div className="postHeader">
        {isAccount ? <Button>
          <MoreVert />
        </Button> : null}
      </div>
      <img src={postImage} alt="Post IMG" />

      <div className="postDetails">

        <Avatar src={ownerImage} alt="Owner Image" sx={{
          height: '3vmax',
          width: '3vmax',
        }}/>

        <Link to={`/user/${ ownerId }`}>

          <Typography fontWeight={ 700 }>{ownerName}</Typography>

        </Link>

        <Typography
          fontWeight={100}
          color="rgba(0, 0, 0, 0.582)"
          style={{ alignSelf: 'center' }}
        >
          {caption}
        </Typography>

      </div>

      <button style={{
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        margin: '1vmax 2vmax'
      }}
      >
         <Typography>4 Likes</Typography>
      </button>
      
      <div className="postFooter">

        <Button onClick={ handleLike}>
          {
            liked ? <Favorite style = {{color: 'red'}} /> : <FavoriteBorder />
        }
        </Button>

        <Button>
          <ChatBubbleOutline />
        </Button>

        {isDelete ? (
           <Button>
          <DeleteOutline />
        </Button>
       ) : null}

      </div>
    </div>
  )
}

export default Post