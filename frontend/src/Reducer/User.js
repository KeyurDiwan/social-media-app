import { createReducer } from '@reduxjs/toolkit';

const initialState = {
    // isAuthenticated: false,
};

export const userReducer = createReducer( initialState, {
    LoginRequest: ( state, action ) => {
        state.loading = true;
     },
    LoginSuccess: ( state, action ) => { 
        state.loading = false;
        state.user = action.payload;
         state.isAuthenticated = true;
    },
    LoginFailure: ( state, action ) => {
        state.loading = false;
        state.error = action.payload;
         state.isAuthenticated = false;
     },

    RegisterRequest: ( state, action ) => { 
        state.loading = true;
    },
    RegisterSuccess: ( state, action ) => {
        state.loading = false;
        state.user = action.payload;
         state.isAuthenticated = true;
       
     },
    RegisterFailure: ( state, action ) => { 
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    },

    LoadUserRequest: ( state, action ) => {
        state.loading = true;
     },
    LoadUserSuccess: ( state, action ) => { 
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
    },
    LoadUserFailure: ( state, action ) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    },
    clearErrors: ( state ) => {
        state.error = null;
    },

} ); 


// export const postOfFollowingReducer = createReducer( initialState, {
//     postOfFollowingRequest: ( state ) => {
//         state.loading = true;
//     },
//     postOfFollowingSuccess: ( state, action ) => {
//         state.loading = false;
//         state.posts = action.payload;
//     },
//     postOfFollowingFailure: ( state, action ) => {
//         state.loading = false;
//         state.error = action.payload;
//     },
//     clearErrors: ( state ) => {
//         state.error = null;
//     },
// } );

export const postOfFollowingReducer = createReducer( initialState, {
    postOfFollowingRequest: ( state ) => {
        state.loading = true;
    },
    postOfFollowingSuccess: ( state, action ) => {
        state.loading = false;
        state.posts = action.payload;
    },
    postOfFollowingFailure: ( state, action ) => {
        state.loading = false;
        state.error = action.payload;
    },
    clearErrors: ( state ) => {
        state.error = null;
    },
} );


export const allUsersReducer = createReducer( initialState, {
    allUsersRequest: ( state ) => {
        state.loading = true;
    },
    allUsersSuccess: ( state, action ) => {
        state.loading = false;
        state.users = action.payload;
    },
    allUsersFailure: ( state, action ) => {
        state.loading = false;
        state.error = action.payload;
    },
    clearErrors: ( state ) => {
        state.error = null;
    },
} );

