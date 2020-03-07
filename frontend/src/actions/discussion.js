import axios from "axios";
import {
    GET_DISCUSSIONS,
    SELECT_DISCUSSION,
    GET_USER_DISCUSSIONS,
    ADD_DISCUSSION_SUCCESS,
    ADD_DISCUSSION,
    ADD_CLAIM, ADD_CLAIM_DIALOG, EDIT_DISCUSSION
} from "./types";
import { returnErrors } from "./messages";

import Discussion from "../components/disscussion/discussion";
import {BaseUrl} from "../BaseUrl";

// GET LEADS
export const getDiscussions = () => (dispatch, getState) => {
    axios
        .get(`${BaseUrl}/api/discussions/`, getState)
        .then(res => {
            dispatch({
                type: GET_DISCUSSIONS,
                payload: res.data
            });
        })
        .catch(err =>
            console.log(err)
        );
};

export const selectDiscussion=(id) =>(dispatch,getState)=>{
    dispatch({
        type:SELECT_DISCUSSION,
        payload:id
    })
}

export const getUserDiscussions = (id) => (dispatch, getState) => {
    axios
        .get(`${BaseUrl}/api/discussions/`,{params: {
                owner: id
            }}, getState)
        .then(res => {
            dispatch({
                type: GET_USER_DISCUSSIONS,
                payload: res.data
            });
            console.log(res.data);
        })
        .catch(err =>
            console.log(err)
        );
};

export const addDiscussion = (data)  => async (dispatch, getState)  => {
    dispatch({
        type:ADD_DISCUSSION
    })
    console.log(tokenConfig(getState),'tok')
     await axios
        .post(`${BaseUrl}/api/discussions/`, data,tokenConfig(getState))
        .then(res => {
            dispatch({
                type: ADD_DISCUSSION_SUCCESS,
                payload: res.data,
            });
            dispatch(returnErrors(null, null));
        })
        .catch(err => {
            console.log(err.response);
            dispatch(returnErrors(err.response.data, err.response.statusText));
        });
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

export const editDiscussion = (data, name) => {
    return {
        type: EDIT_DISCUSSION,
        payload: data,
        name: name
};
};