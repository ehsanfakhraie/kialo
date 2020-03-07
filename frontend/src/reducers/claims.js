import { ADD_CLAIM, SELECT_CLAIM,UPDATE_CLAIMS,GET_USER_CLAIMS } from "../actions/types.js";
import {SELECT_TYPE} from "../actions/types";

const initialState = {
    claims: [],
    userClaims:[]
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_CLAIM:
            return {
                ...state,
                claims: [...state.claims, action.payload]
            }
        case SELECT_CLAIM:
            return{
                ...state,
                selectedClaim:action.payload
            }
        case UPDATE_CLAIMS:
            return{
                ...state,
                claims:action.payload
            }
        case GET_USER_CLAIMS:
            return{
                ...state,
                userClaims:action.payload
            }
        case SELECT_TYPE:
            return {
                ...state,
                type:action.payload
            }
        default:
            return state;
    }
}
