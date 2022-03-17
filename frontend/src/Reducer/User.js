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
});  