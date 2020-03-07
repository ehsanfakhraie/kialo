import { GET_ERRORS } from "../actions/types";

const initialState = {
    msg: {},
    status: null,
    searchError:null
};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_ERRORS:
            console.log(action.payload.status,'ssss')
            return {
                msg: action.payload.msg,
                status: action.payload.status
            };
        case 'GET_ERRORS_Message':
            return {
                searchError: action.payload
            }
        default:
            return state;
    }
}