import { CREATE_MESSAGE, GET_ERRORS } from "./types";

// CREATE MESSAGE
export const createMessage = msg => {
    return {
        type: CREATE_MESSAGE,
        payload: msg
    };
};

// RETURN ERRORS
export const returnErrors = (msg, status) => {
    return {
        type: GET_ERRORS,
        payload: { msg, status }
    };
};

export const searchError = (msg) =>{
    return{
        type: 'GET_ERRORS_Message',
        payload: msg
    }
}
