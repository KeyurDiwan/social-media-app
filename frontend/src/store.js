import { configureStore } from "@reduxjs/toolkit"
import { likeReducer, myPostsReducer, userPostsReducer } from "./Reducer/Post";
import { allUsersReducer, postOfFollowingReducer, userReducer } from "./Reducer/User";



const store = configureStore(  {
    
    reducer: {
        user: userReducer,
    postOfFollowing: postOfFollowingReducer,
    allUsers: allUsersReducer,
    like: likeReducer,
    myPosts: myPostsReducer,
    // userProfile: userProfileReducer),
    userPosts: userPostsReducer,

    }


} )

export default store;
    