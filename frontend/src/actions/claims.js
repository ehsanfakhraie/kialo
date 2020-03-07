import axios from "axios";
import {ADD_CLAIM, SELECT_DISCUSSION, SELECT_CLAIM, UPDATE_CLAIMS, GET_USER_CLAIMS, SELECT_TYPE} from "./types";
import {returnErrors} from "./messages";
import {BaseUrl} from "../BaseUrl";

// ADD LEAD
export const addClaim = data => (dispatch, getState) => {
    axios
        .post(`${BaseUrl}/api/claims/`, data,tokenConfig(getState))
        .then(res => {
            dispatch({
                type: ADD_CLAIM,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
        });
};


export const selectClaim=id=>(dispatch,getState)=>{
    dispatch({
        type:SELECT_CLAIM,
        payload:id
    })
}

export const typeSelect=type=>(dispatch,getState)=>{
    dispatch({
        type:SELECT_TYPE,
        payload:type
    })
}

export const updateClaims=claims=>(dispatch,getState)=>{
    dispatch({
        type:UPDATE_CLAIMS,
        payload:claims
    })
}
export const getUserClaims = (id) => (dispatch, getState) => {
    axios
        .get(`${BaseUrl}/api/claims/`,{params: {
                owner: id
            }}, getState)
        .then(res => {
            dispatch({
                type: GET_USER_CLAIMS,
                payload: res.data
            });
            console.log(res.data);
        })
        .catch(err =>
            console.log(err)
        );
};

export const tokenConfig = getState => {
    // Get token from state
    const token = getState().auth.token;

    // Headers
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };

    // If token, add to headers config
    if (token) {
        config.headers["Authorization"] = `Token ${token}`;
    }

    return config;
};