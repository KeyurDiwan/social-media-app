import { createReducer } from '@reduxjs/toolkit';

const initialState = {};

export const userReducer = createReducer( initialState, {
    LoginRequest: ( state, action ) => {
        state.loading = true;
     },
    LoginSuccess: ( state, action ) => { 
        state.loading = false;
        state.user = action.payload;
    },
    LoginFailure: ( state, action ) => {
        state.loading = false;
        state.error = action.payload;
     },

    RegisterRequest: ( state, action ) => { 
        state.loading = true;
    },
    RegisterSuccess: ( state, action ) => {
        state.loading = false;
        state.user = action.payload;
     },
    RegisterFailure: ( state, action ) => { 
        state.loading = false;
        state.error = action.payload;
    },

    LoadUserRequest: ( state, action ) => {
        state.loading = true;
     },
    LoadUserSuccess: ( state, action ) => { 
        state.loading = false;
        state.user = action.payload;
    },
    LoadUserFailure: ( state, action ) => {
        state.loading = false;
        state.error = action.payload;
     },
});  