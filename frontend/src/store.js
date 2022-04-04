import { configureStore } from "@reduxjs/toolkit"
import { likeReducer, myPostsReducer } from "./Reducer/Post";
import { allUsersReducer, postOfFollowingReducer, userReducer } from "./Reducer/User";



const store = configureStore(  {
    
    reducer: {
        user: userReducer,
        postOfFollowing: postOfFollowingReducer,
        allUsers: allUsersReducer,
        like: likeReducer,
        myPosts: myPostsReducer,

    }


} )

export default store;
    