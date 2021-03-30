import { GET_ERRORS } from "../actions/types";

const initialState = {
    msg: {},
    status: null,
    searchError:null,
    a:1
};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_ERRORS:
            console.log(action.payload.status,'ssss')
            return {
                msg: action.payload.msg,
                status: action.payload.status,
                a: state.a+1,
            };
        case 'GET_ERRORS_Message':
            return {
                searchError: action.payload
            }
        default:
            return state;
    }
}