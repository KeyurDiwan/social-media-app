import { configureStore } from "@reduxjs/toolkit"
import { userReducer } from "./Reducer/User";



const store = configureStore(  {
    
    reducer: {
        user: userReducer,

    }


} )

export default store;
    